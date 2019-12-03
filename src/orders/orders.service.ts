import { Injectable, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entities/Product.entity";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { OrderValidationErrorModel } from "./dto/OrderValidationErrorModel.dto";
import { OrderValidationErrorType } from "./dto/OrderValidationErrorType.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";
import { PlaceOrderDto } from "./dto/PlaceOrder.dto";
import { SessionDto } from "../auth/dto/Session.dto";
import { UserEntity } from "../users/entities/User.entity";
import { ApiException } from "../common/ApiException";
import { OrderEntity } from "./entities/Order.entity";
import { OrderDto } from "./dto/Order.dto";
import { OrderStatus } from "./models/OrderStatus";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async query(userId?: string): Promise<OrderDto> {
    if (userId) {
      return (this.ordersRepository.find({
        where: { user: userId },
      }) as unknown) as OrderDto;
    } else {
      return (this.ordersRepository.find() as unknown) as OrderDto;
    }
  }

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
          `Product does not exist`,
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
          `Product price has changed`,
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
            `Choice does not exist`,
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
            `Option does not exist`,
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
            `Option price has changed`,
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
      throw new ApiException(HttpStatus.NOT_FOUND, `User does not exist`);
    }
    const address = user.addresses.filter(a => a.id === dto.addressId)[0];
    if (!address) {
      throw new ApiException(HttpStatus.NOT_FOUND, `Address does not exist`);
    }

    const productIds = dto.items.map(i => i.productId);
    const products = await this.productsRepository.findByIds(productIds);
    const orderEntity = OrderEntity.fromDto(dto, products, user, address);

    return (this.ordersRepository.save(orderEntity) as unknown) as OrderDto;
  }

  async cancelOrder(session: SessionDto, id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id, userId: session.userId },
    });

    if (!order) {
      throw new ApiException(HttpStatus.NOT_FOUND, "Order not found", {
        reason: "Order either does not exist or does not belong to the user",
      });
    }

    await this.ordersRepository.update(
      { id },
      { status: OrderStatus.CANCELLED },
    );
  }

  async cancelOrderAdmin(id: number) {
    await this.ordersRepository.update(
      { id },
      { status: OrderStatus.CANCELLED },
    );
  }
}
