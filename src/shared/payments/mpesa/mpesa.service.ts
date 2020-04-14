import {
  Injectable,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { PaymentEntity } from "../../../shared/payments/entities/Payment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RedisService } from "../../redis/redis.service";
import { config } from "../../../common/Config";
import * as axios from "axios";
import * as moment from "moment";
import { RequestMpesaDto } from "./dto/RequestMpesa.dto";
import { SessionDto } from "../../../client/auth/dto/Session.dto";
import { OrderEntity } from "../../orders/entities/Order.entity";
import { PaymentMethod } from "../../payments/models/PaymentMethod";
import { PaymentStatus } from "../../payments/models/PaymentStatus";
import { StkCallbackDto } from "./dto/StkCallback.dto";
import { CustomLogger } from "../../../common/CustomLogger";
import { UserEntity } from "../../users/entities/User.entity";
import { NotificationsService } from "../../notifications/notifications.service";
import { ApiResponseDto } from "../../../common/dto/ApiResponse.dto";
import { OrderPaymentStatus } from "../../orders/models/OrderPaymentStatus";
import { NotificationReason } from "../../notifications/model/NotificationReason";
import { OrderStatus } from "../../orders/models/OrderStatus";
import { QueueService } from "../../queue/queue.service";
import { QueryRequestResponseDto } from "./dto/QueryRequestResponse.dto";

@Injectable()
export class MpesaService {
  private safaricomBaseUrl = "https://sandbox.safaricom.co.ke";
  private logger = new CustomLogger("MpesaService");

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationsService,
    @Inject(forwardRef(() => QueueService))
    private readonly queueService: QueueService,
  ) {}

  async request(
    session: SessionDto,
    dto: RequestMpesaDto,
  ): Promise<ApiResponseDto> {
    const order = await this.ordersRepository.findOne({ id: dto.orderId });
    if (!order) {
      throw new NotFoundException({ message: "Order does not exist" });
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

      this.queueService.scheduleCheckMpesaPayment(res.data.CheckoutRequestID);

      return new ApiResponseDto(HttpStatus.OK, "Payment initialized");
    } catch (e) {
      const error = {
        message: e.message,
        responseMessage: e.response ? e.response.data.errorMessage : e.message,
      };
      throw new InternalServerErrorException({
        message: "Unable to initiate payment",
        meta: { ...error },
      });
    }
  }

  async callback(body) {
    const parsedBody = this.parseCallbackData(body);
    this.logger.debug(`Callback received for ${parsedBody.checkoutRequestId}`);

    const payment = await this.paymentsRepository.findOne({
      transactionRef: parsedBody.checkoutRequestId,
    });
    const user = await this.usersRepository.findOne({
      id: payment.initializedBy,
    });

    if (parsedBody.resultCode === "0") {
      this.setPaymentCompleted(body, parsedBody, payment, user);
    } else {
      this.setPaymentErrored(parsedBody, payment, user);
    }
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<boolean> {
    const authHeader = await this.getAuthorizationHeader();
    const shortcode = "174379";
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const passKey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const password = Buffer.from(`${shortcode}${passKey}${timestamp}`).toString(
      "base64",
    );
    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };
    try {
      const res = await axios.default.post(
        `${this.safaricomBaseUrl}/mpesa/stkpushquery/v1/query`,
        body,
        { headers: { Authorization: authHeader } },
      );
      const data: QueryRequestResponseDto = res.data;

      const payment = await this.paymentsRepository.findOne({
        transactionRef: checkoutRequestId,
      });

      const user = await this.usersRepository.findOne({
        id: payment.initializedBy,
      });

      const parsedBody: StkCallbackDto = {
        checkoutRequestId,
        merchantRequestId: data.MerchantRequestID,
        resultCode: data.ResultCode,
        resultDesc: data.ResultDesc,
      };
      if (data.ResultCode === "0") {
        await this.setPaymentCompleted(body, parsedBody, payment, user);
      } else {
        await this.setPaymentErrored(parsedBody, payment, user);
      }

      return true;
    } catch (e) {
      if (e.response) {
        if (!e.response.data.errorMessage.includes("processed")) {
          this.logger.error(e.response.data.errorMessage);
        }
      } else {
        this.logger.error(e.message, e.stack);
      }

      return false;
    }
  }

  private async setPaymentCompleted(
    body,
    parsedBody: StkCallbackDto,
    payment: PaymentEntity,
    user: UserEntity,
  ) {
    this.logger.debug(
      `Payment ${parsedBody.checkoutRequestId} was completed successfully`,
    );

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
    this.logger.debug(`Updated payment ${parsedBody.checkoutRequestId}`);

    await this.ordersRepository.update(
      { id: payment.orderId },
      {
        status: OrderStatus.CONFIRMED,
        paymentMethod: PaymentMethod.MPESA,
        paymentStatus: OrderPaymentStatus.PAID,
      },
    );
    this.logger.debug(`Updated order ${payment.orderId} to PAID`);

    this.queueService.startOrderSequence(payment.orderId);

    this.notificationService.send(
      user,
      NotificationReason.PAYMENT_COMPLETED,
      "Payment completed",
      { orderId: payment.orderId },
    );
  }

  private async setPaymentErrored(
    parsedBody: StkCallbackDto,
    payment: PaymentEntity,
    user: UserEntity,
  ) {
    this.logger.debug(
      `Payment ${parsedBody.checkoutRequestId} failed with reason '${parsedBody.resultDesc}')`,
    );

    const updated = {
      status: PaymentStatus.CANCELLED,
      paymentResult: parsedBody.resultDesc,
      dateUpdated: moment().unix(),
    };
    await this.paymentsRepository.update(
      { transactionRef: parsedBody.checkoutRequestId },
      updated,
    );
    this.logger.debug(`Updated payment ${parsedBody.checkoutRequestId}`);

    this.notificationService.send(
      user,
      NotificationReason.PAYMENT_CANCELLED,
      "Payment cancelled",
      { orderId: payment.orderId },
    );
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
