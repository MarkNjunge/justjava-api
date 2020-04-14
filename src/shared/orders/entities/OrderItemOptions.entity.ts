import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { OrderItemEntity } from "./OrderItem.entity";
import { PlaceOrderItemOptionDto } from "../dto/PlaceOrderItemOption.dto";
import { ProductEntity } from "../../products/entities/Product.entity";

@Entity({ name: "order_item_options" })
export class OrderItemOptionsEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => OrderItemEntity, item => item.options, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_item_id" })
  item: OrderItemEntity;

  @Column({ name: "choice_id" })
  choiceId: number;

  @Column({ name: "choice_name" })
  choiceName: string;

  @Column({ name: "option_id" })
  optionId: number;

  @Column({ name: "option_name" })
  optionName: string;

  @Column({ name: "option_price", type: "real" })
  optionPrice: number;

  static fromDto(
    dto: PlaceOrderItemOptionDto,
    product: ProductEntity,
  ): OrderItemOptionsEntity {
    const choice = product.choices.filter(c => c.id === dto.choiceId)[0];
    const option = choice.options.filter(o => o.id === dto.optionId)[0];

    const entity = new OrderItemOptionsEntity();
    entity.choiceId = choice.id;
    entity.choiceName = choice.name;
    entity.optionId = option.id;
    entity.optionName = option.name;
    entity.optionPrice = option.price;

    return entity;
  }
}
