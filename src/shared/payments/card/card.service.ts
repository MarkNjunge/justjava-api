import { Injectable, HttpStatus, NotFoundException } from "@nestjs/common";
import { SessionDto } from "../../../client/auth/dto/Session.dto";
import { InitiatePaymentDto } from "./dto/InitiatePayment.dto";
import { UserEntity } from "../../../shared/users/entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentEntity } from "../entities/Payment.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "../../../shared/orders/entities/Order.entity";
import * as moment from "moment";
import { RavepayService } from "../ravepay/ravepay.service";
import { PaymentMethod } from "../models/PaymentMethod";
import { PaymentStatus } from "../models/PaymentStatus";
import { ApiResponseDto } from "../../../common/dto/ApiResponse.dto";
import { OrderPaymentStatus } from "../../orders/models/OrderPaymentStatus";
import { CustomLogger } from "../../../common/logging/CustomLogger";
import { NotificationsService } from "../../notifications/notifications.service";
import { NotificationReason } from "../../notifications/model/NotificationReason";
import { CheckCardDto } from "./dto/CheckCard.dto";
import { OrderStatus } from "../../orders/models/OrderStatus";
import { QueueService } from "../../queue/queue.service";

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
    private readonly queueService: QueueService,
  ) {
    this.logger = new CustomLogger("CardService");
  }

  async checkCard(
    session: SessionDto,
    dto: CheckCardDto,
  ): Promise<ApiResponseDto> {
    this.logger.debug("Checking authorization method for card");
    const user = await this.usersRepository.findOne({
      where: { id: session.userId },
    });
    if (!user) {
      throw new NotFoundException({ message: "User does not exist" });
    }

    const order = await this.ordersRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!order) {
      throw new NotFoundException({ message: "Order does not exist" });
    }

    this.logger.debug("Initiating Ravepay request");
    const response = await this.ravepayService.checkCard(
      dto,
      order.totalPrice,
      user,
    );
    this.logger.debug(`Card uses ${response} verification`);

    return { httpStatus: 200, message: response };
  }

  async initiateAddressPayment(session: SessionDto, dto: InitiatePaymentDto) {
    const user = await this.usersRepository.findOne({
      where: { id: session.userId },
    });
    if (!user) {
      throw new NotFoundException({ message: "User does not exist" });
    }

    const order = await this.ordersRepository.findOne({
      where: { id: dto.orderId },
    });
    if (!order) {
      throw new NotFoundException({ message: "Order does not exist" });
    }

    this.logger.debug("Initiating Ravepay request");
    const initiateResponse = await this.ravepayService.initiateAddressPayment(
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
      "1234",
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
      {
        status: OrderStatus.CONFIRMED,
        paymentMethod: PaymentMethod.CARD,
        paymentStatus: OrderPaymentStatus.PAID,
      },
    );
    this.logger.debug(`Updated order ${dto.orderId} to PAID`);

    this.queueService.startOrderSequence(payment.orderId);

    this.notificationService.send(
      user,
      NotificationReason.PAYMENT_COMPLETED,
      "Payment completed",
      { orderId: dto.orderId },
    );

    return new ApiResponseDto(HttpStatus.OK, "Payment completed");
  }
}
