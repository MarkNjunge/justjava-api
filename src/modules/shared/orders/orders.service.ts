import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entities/Product.entity";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { OrderValidationErrorModel } from "./dto/OrderValidationErrorModel.dto";
import { OrderValidationErrorType } from "./dto/OrderValidationErrorType.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";
import { PlaceOrderDto } from "./dto/PlaceOrder.dto";
import { SessionDto } from "../../client/auth/dto/Session.dto";
import { UserEntity } from "../users/entities/User.entity";
import { OrderEntity } from "./entities/Order.entity";
import { OrderDto } from "./dto/Order.dto";
import { OrderStatus } from "./models/OrderStatus";
import { ChangePaymentMethodDto } from "./dto/ChangePaymentMethod.dto";
import { OrderPaymentStatus } from "./models/OrderPaymentStatus";
import { ApiResponseDto } from "../dto/ApiResponse.dto";
import { UpdateOrderStatusDto } from "./dto/UpdateOrderStatus.dto";
import { Logger } from "../../../utils/logging/Logger";
import { NotificationsService } from "../notifications/notifications.service";
import { NotificationReason } from "../notifications/model/NotificationReason";

@Injectable()
export class OrdersService {
  private logger = new Logger("OrdersService");

  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly notificationService: NotificationsService,
  ) {}

  async query(userId?: string): Promise<OrderDto> {
    if (userId) {
      return (this.ordersRepository.find({
        where: { user: userId },
      }) as unknown) as OrderDto;
    }

    return (this.ordersRepository.find() as unknown) as OrderDto;

  }

  async getOrderById(session: SessionDto, id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: session.userId } },
    });

    if (!order) {
      throw new NotFoundException({
        message: "Order not found",
        meta: {
          reason: "Order either does not exist or does not belong to the user",
        },
      });
    } else {
      return order;
    }
  }

  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  async verifyOrderItems(dto: VerifyOrderDto): Promise<OrderValidationError[]> {
    const errors: OrderValidationError[] = [];

    for (const item of dto.items) {
      // Verify product exists
      const product = await this.productsRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        const error = new OrderValidationError(
          item.index,
          item.productId,
          OrderValidationErrorModel.PRODUCT,
          OrderValidationErrorType.MISSING,
          "Product does not exist",
        );
        errors.push(error);
        continue;
      }

      // Verify product price
      if (product.price !== item.productBasePrice) {
        const error = new OrderValidationError(
          item.index,
          item.productId,
          OrderValidationErrorModel.PRODUCT,
          OrderValidationErrorType.PRICE_CHANGE,
          "Product price has changed",
          product.price,
        );
        errors.push(error);
      }

      for (const itemChoice of item.options) {
        const choice = product.choices.filter(
          c => c.id === itemChoice.choiceId,
        )[0];

        // Verify choice exists
        if (!choice) {
          const error = new OrderValidationError(
            item.index,
            itemChoice.choiceId,
            OrderValidationErrorModel.CHOICE,
            OrderValidationErrorType.MISSING,
            "Choice does not exist",
          );
          errors.push(error);
          continue;
        }

        const option = choice.options.filter(
          o => o.id === itemChoice.optionId,
        )[0];

        // Verify option exists
        if (!option) {
          const error = new OrderValidationError(
            item.index,
            itemChoice.choiceId,
            OrderValidationErrorModel.OPTION,
            OrderValidationErrorType.MISSING,
            "Option does not exist",
          );
          errors.push(error);
          continue;
        }

        // Verify option price
        if (option.price !== itemChoice.optionPrice) {
          const error = new OrderValidationError(
            item.index,
            itemChoice.choiceId,
            OrderValidationErrorModel.OPTION,
            OrderValidationErrorType.PRICE_CHANGE,
            "Option price has changed",
            option.price,
          );
          errors.push(error);
        }
      }
    }

    return errors;
  }

  async placeOrder(session: SessionDto, dto: PlaceOrderDto): Promise<OrderDto> {
    const user = await this.usersRepository.findOne({
      where: { id: session.userId },
    });
    if (!user) {
      throw new NotFoundException({ message: "User does not exist" });
    }
    const address = user.addresses.filter(a => a.id === dto.addressId)[0];
    if (!address) {
      throw new NotFoundException({ messge: "Address does not exist" });
    }

    const productIds = dto.items.map(i => i.productId);
    const products = await this.productsRepository.findByIds(productIds);
    const orderEntity = OrderEntity.fromDto(dto, products, user, address);

    const order = await this.ordersRepository.save(orderEntity);
    // Add the userId and remove the user object in order to match the response dto
    order.userId = user.id;
    delete order.user;
    delete order.address;

    return (order as unknown) as OrderDto;
  }

  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  async changePaymentMethod(
    session: SessionDto,
    id: string,
    dto: ChangePaymentMethodDto,
  ): Promise<ApiResponseDto> {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: session.userId } },
    });

    if (!order) {
      throw new NotFoundException({
        message: "Order not found",
        meta: {
          reason: "Order either does not exist or does not belong to the user",
        },
      });
    }

    if (order.paymentStatus === OrderPaymentStatus.PAID) {
      throw new BadRequestException({
        message: "Order has already been paid for.",
        meta: {
          reason:
            "Payment method cannot be changed for orders that have already been paid for.",
        },
      });
    }

    await this.ordersRepository.update(
      { id },
      { paymentMethod: dto.paymentMethod },
    );

    return { httpStatus: HttpStatus.OK, message: "Payment method updated" };
  }

  async cancelOrder(session: SessionDto, id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, user: { id: session.userId } },
    });

    if (!order) {
      throw new NotFoundException({
        message: "Order not found",
        meta: {
          reason: "Order either does not exist or does not belong to the user",
        },
      });
    }

    await this.ordersRepository.update(
      { id },
      { status: OrderStatus.CANCELLED },
    );
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    this.logger.debug(`Updating order ${id} to ${dto.orderStatus}`);
    const order = await this.ordersRepository.findOne({
      where: { id },
    });
    const user = await await this.usersRepository.findOne({ id: order.userId });

    await this.ordersRepository.update({ id }, { status: dto.orderStatus });
    this.logger.debug(`Order ${id} updated to ${dto.orderStatus}`);

    await this.notificationService.send(
      user,
      NotificationReason.ORDER_STATUS_UPDATED,
      "Order status updated",
      { orderId: id, orderStatus: dto.orderStatus },
    );
  }

  async cancelOrderAdmin(id: string) {
    await this.ordersRepository.update(
      { id },
      { status: OrderStatus.CANCELLED },
    );
  }
}
