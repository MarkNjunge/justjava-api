import { Injectable, HttpStatus } from "@nestjs/common";
import { SessionDto } from "../../client/auth/dto/Session.dto";
import { InitiatePaymentDto } from "./dto/InitiatePayment.dto";
import { UserEntity } from "../../shared/users/entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "../entities/Payment.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "../../shared/orders/entities/Order.entity";
import { ApiException } from "../../common/ApiException";
import * as moment from "moment";
import { RavepayService } from "../../ravepay/ravepay.service";
import { PaymentMethod } from "../models/PaymentMethod";
import { PaymentStatus } from "../models/PaymentStatus";
import { ApiResponseDto } from "../../common/dto/ApiResponse.dto";
import { OrderPaymentStatus } from "../../shared/orders/models/OrderPaymentStatus";
import { CustomLogger } from "../../common/CustomLogger";
import { NotificationsService } from "../../notifications/notifications.service";
import { NotificationReason } from "../../notifications/model/NotificationReason";

@Injectable()
export class CardService {
  private logger: CustomLogger;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly ravepayService: RavepayService,
    private readonly notificationService: NotificationsService,
  ) {
    this.logger = new CustomLogger("CardService");
  }

  async initiate(session: SessionDto, dto: InitiatePaymentDto) {
    const user = await this.usersRepository.findOne({
      where: { id: session.userId },
    });
    if (!user) {
      throw new ApiException(HttpStatus.NOT_FOUND, "User does not exist");
    }

    const order = await this.ordersRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!order) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Order does not exist");
    }
    if (order.paymentMethod !== PaymentMethod.CARD) {
      throw new ApiException(
        HttpStatus.BAD_REQUEST,
        "Order does not use card as a payment method. Change the PaymentMethod first.",
      );
    }

    this.logger.debug("Initiating Ravepay request");
    const initiateResponse = await this.ravepayService.initiate(
      dto,
      order.totalPrice,
      user,
    );
    const flwRef = initiateResponse.data.flwRef;
    this.logger.debug(`Ravepay request successful: ${flwRef}`);

    const payment = new PaymentEntity();
    payment.orderId = dto.orderId;
    payment.initializedBy = session.userId;
    payment.method = PaymentMethod.CARD;
    payment.status = PaymentStatus.PENDING;
    payment.amount = order.totalPrice;
    payment.transactionRef = flwRef;
    payment.dateCreated = moment().unix();
    await this.paymentsRepository.save(payment);
    this.logger.debug(`Saved pending payment for order ${dto.orderId}`);

    this.logger.debug(`Initiating verification for ${flwRef}`);
    const verificationResponse = await this.ravepayService.verify(
      initiateResponse.data.flwRef,
    );
    this.logger.debug(`Verification for ${flwRef} successful`);

    const updated = {
      status: PaymentStatus.COMPLETED,
      paymentResult: verificationResponse.message,
      paymentRef: flwRef,
      payerRef: verificationResponse.data.tx.customer.email,
      dateUpdated: moment().unix(),
      rawResult: JSON.stringify(verificationResponse),
    };
    await this.paymentsRepository.update({ transactionRef: flwRef }, updated);
    this.logger.debug("Updated payment info");

    await this.ordersRepository.update(
      { id: dto.orderId },
      { paymentStatus: OrderPaymentStatus.PAID },
    );
    this.logger.debug(`Updated order ${dto.orderId} to PAID`);

    this.notificationService.send(
      user.fcmToken,
      NotificationReason.PAYMENT_COMPLETED,
      "Payment completed",
      { orderId: dto.orderId },
    );

    return new ApiResponseDto(HttpStatus.OK, "Payment completed");
  }
}
