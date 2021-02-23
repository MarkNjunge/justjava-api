import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { OrderEntity } from "./Order.entity";
import { OrderItemOptionsEntity } from "./OrderItemOptions.entity";
import { PlaceOrderItemDto } from "../dto/PlaceOrderItem.dto";
import { ProductEntity } from "../../products/entities/Product.entity";

@Entity({ name: "order_items" })
export class OrderItemEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => OrderEntity, order => order.items, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  order: OrderEntity;

  @Column({ name: "product_id" })
  productId: number;

  @Column({ name: "product_name" })
  productName: string;

  @Column({ name: "product_base_price", type: "real" })
  productBasePrice: number;

  @Column({ name: "total_price", type: "real" })
  totalPrice: number;

  @Column({ name: "quantity" })
  quantity: number;

  @OneToMany(() => OrderItemOptionsEntity, option => option.item, {
    eager: true,
    cascade: true,
  })
  options: OrderItemOptionsEntity[];

  static fromDto(
    dto: PlaceOrderItemDto,
    product: ProductEntity,
  ): OrderItemEntity {
    const options = dto.options.map(o => OrderItemOptionsEntity.fromDto(o, product),
    );
    const optionsTotalPrice = options
      .map(o => o.optionPrice)
      .reduce((acc, c) => acc + c);

    const entity = new OrderItemEntity();
    entity.productId = product.id;
    entity.productName = product.name;
    entity.productBasePrice = product.price;
    entity.totalPrice = (product.price + optionsTotalPrice) * dto.quantity;
    entity.quantity = dto.quantity;
    entity.options = dto.options.map(o => OrderItemOptionsEntity.fromDto(o, product),
    );

    return entity;
  }
}
