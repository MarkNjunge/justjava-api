import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductEntity } from "../products/entities/Product.entity";
import { OrderValidationError } from "./dto/OrderValidationError.dto";
import { OrderValidationErrorModel } from "./dto/OrderValidationErrorModel.dto";
import { OrderValidationErrorType } from "./dto/OrderValidationErrorType.dto";
import { VerifyOrderDto } from "./dto/VerifyOrder.dto";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

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
}
