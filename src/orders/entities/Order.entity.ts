import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";
import { UserEntity } from "../../users/entities/User.entity";
import { AddressEntity } from "../../users/entities/Address.entity";
import { OrderItemEntity } from "./OrderItem.entity";
import { PlaceOrderDto } from "../dto/PlaceOrder.dto";
import { OrderStatus } from "../models/OrderStatus";
import { OrderPaymentStatus } from "../models/OrderPaymentStatus";
import { ProductEntity } from "../../products/entities/Product.entity";

@Entity({ name: "orders" })
export class OrderEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ name: "additional_comments", nullable: true })
  additionalComments: string;

  @Column({ name: "total_price", type: "real" })
  totalPrice: number;

  @Column({ type: "bigint", name: "date_placed" })
  datePlaced: number;

  @Column({ name: "status" })
  status: string;

  @Column({ name: "payment_method" })
  paymentMethod: string;

  @Column({ name: "payment_status" })
  paymentStatus: string;

  @ManyToOne(type => UserEntity, user => user.orders, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @RelationId((order: OrderEntity) => order.user)
  userId: number;

  @ManyToOne(type => AddressEntity, { onDelete: "SET NULL" })
  @JoinColumn({ name: "user_address_id" })
  address: AddressEntity;

  @RelationId((order: OrderEntity) => order.address)
  addressId: number;

  @OneToMany(type => OrderItemEntity, item => item.order, {
    eager: true,
    cascade: true,
  })
  items: OrderItemEntity[];

  static fromDto(
    dto: PlaceOrderDto,
    products: ProductEntity[],
    user: UserEntity,
    address: AddressEntity,
  ) {
    const items = dto.items.map(i =>
      OrderItemEntity.fromDto(i, products.filter(p => p.id === i.productId)[0]),
    );
    const totalPrice = items.map(i => i.totalPrice).reduce((acc, c) => acc + c);

    const entity = new OrderEntity();
    entity.additionalComments = dto.additionalComments;
    entity.totalPrice = totalPrice;
    entity.datePlaced = Math.floor(Date.now() / 1000);
    entity.status = OrderStatus.PENDING;
    entity.paymentMethod = dto.paymentMethod;
    entity.paymentStatus = OrderPaymentStatus.UNPAID;
    entity.user = user;
    entity.address = address;
    entity.items = items;

    return entity;
  }
}
