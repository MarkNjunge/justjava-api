import { Injectable, HttpStatus } from "@nestjs/common";
import { PaymentEntity } from "../entities/Payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RedisService } from "../../redis/redis.service";
import { config } from "../../common/Config";
import * as axios from "axios";
import * as moment from "moment";
import { RequestMpesaDto } from "./dto/RequestMpesa.dto";
import { SessionDto } from "../../auth/dto/Session.dto";
import { OrderEntity } from "../../orders/entities/Order.entity";
import { ApiException } from "../../common/ApiException";
import { PaymentMethod } from "../models/PaymentMethod";
import { PaymentStatus } from "../models/PaymentStatus";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { StkCallbackDto } from "./dto/StkCallback.dto";
import { NotificationsService } from "../../notifications/notifications.service";
import { NotificationReason } from "../../notifications/model/NotificationReason";
import { UserEntity } from "../../users/entities/User.entity";

@Injectable()
export class MpesaService {
  private safaricomBaseUrl = "https://sandbox.safaricom.co.ke";

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationsService,
  ) {}

  async request(
    session: SessionDto,
    dto: RequestMpesaDto,
  ): Promise<ApiResponseDto> {
    const order = await this.ordersRepository.findOne({ id: dto.orderId });
    if (!order) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Order does not exist");
    }

    if (order.paymentMethod !== PaymentMethod.MPESA) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        "Order does not use M-Pesa as a payment method. Change the PaymentMethodFirst.",
      );
    }

    const authHeader = await this.getAuthorizationHeader();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const shortcode = "174379";
    const passKey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(`${shortcode}${passKey}${timestamp}`).toString(
      "base64",
    );
    const accountRef = `Order ${dto.orderId}`;

    const body = {
      AccountReference: accountRef,
      Amount: "1", // Always charge ksh.1, regardless of order amount
      BusinessShortCode: shortcode,
      CallBackURL: `${config.mpesa.callbackBaseUrl}/payments/mpesa/callback`,
      PartyA: dto.mobileNumber,
      PartyB: shortcode,
      Password: password,
      PhoneNumber: dto.mobileNumber,
      Timestamp: timestamp,
      TransactionDesc: accountRef,
      TransactionType: "CustomerPayBillOnline",
    };

    try {
      const res = await axios.default.post(
        `${this.safaricomBaseUrl}/mpesa/stkpush/v1/processrequest`,
        body,
        { headers: { Authorization: authHeader } },
      );

      const payment = new PaymentEntity();
      payment.orderId = dto.orderId;
      payment.initializedBy = session.userId;
      payment.method = PaymentMethod.MPESA;
      payment.status = PaymentStatus.PENDING;
      payment.amount = order.totalPrice;
      payment.transactionRef = res.data.CheckoutRequestID;
      payment.dateCreated = moment().unix();

      await this.paymentsRepository.save(payment);

      return new ApiResponseDto(HttpStatus.OK, "Payment initialized");
    } catch (e) {
      const error = {
        message: e.message,
        responseMessage: e.response ? e.response.data.errorMessage : e.message,
      };
      throw new ApiException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Unable to initiate payment",
        { ...error },
      );
    }
  }

  async callback(body) {
    const parsedBody = this.parseCallbackData(body);

    const payment = await this.paymentsRepository.findOne({
      transactionRef: parsedBody.checkoutRequestId,
    });
    const user = await this.usersRepository.findOne({
      id: payment.initializedBy,
    });

    if (parsedBody.resultCode === "0") {
      const updated = {
        status: PaymentStatus.COMPLETED,
        paymentResult: parsedBody.resultDesc,
        paymentRef: parsedBody.mpesaReceiptNumber,
        payerRef: parsedBody.phoneNumber,
        dateUpdated: moment().unix(),
        rawResult: JSON.stringify(body),
      };

      await this.paymentsRepository.update(
        { transactionRef: parsedBody.checkoutRequestId },
        updated,
      );

      this.notificationService.send(
        user.fcmToken,
        NotificationReason.PAYMENT_COMPLETED,
        "Payment completed",
      );
    } else {
      const updated = {
        status: PaymentStatus.CANCELLED,
        paymentResult: parsedBody.resultDesc,
        dateUpdated: moment().unix(),
      };

      await this.paymentsRepository.update(
        { transactionRef: parsedBody.checkoutRequestId },
        updated,
      );

      this.notificationService.send(
        user.fcmToken,
        NotificationReason.PAYMENT_CANCELLED,
        "Payment cancelled",
      );
    }
  }

  private async getAuthorizationHeader(): Promise<string> {
    const token = await this.redisService.getMpesaAccessToken();

    if (token) {
      return `Bearer ${token}`;
    } else {
      const key = Buffer.from(
        `${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`,
      ).toString("base64");
      const authHeader = `Basic ${key}`;

      const res = await axios.default.get(
        `${this.safaricomBaseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      await this.redisService.saveMpesaAccessToken(res.data);
      return this.getAuthorizationHeader();
    }
  }

  private parseCallbackData(responseData): StkCallbackDto {
    responseData = responseData.Body.stkCallback;

    const parsedData: any = {};
    parsedData.merchantRequestId = responseData.MerchantRequestID;
    parsedData.checkoutRequestId = responseData.CheckoutRequestID;
    parsedData.resultDesc = responseData.ResultDesc;
    parsedData.resultCode = responseData.ResultCode.toString();

    if (parsedData.resultCode === 0) {
      responseData.CallbackMetadata.Item.forEach(element => {
        switch (element.Name) {
          case "Amount":
            parsedData.amount = element.Value;
            break;
          case "MpesaReceiptNumber":
            parsedData.mpesaReceiptNumber = element.Value;
            break;
          case "TransactionDate":
            parsedData.transtactionDate = element.Value;
            break;
          case "PhoneNumber":
            parsedData.phoneNumber = element.Value;
            break;
        }
      });
    }

    return parsedData;
  }
}
