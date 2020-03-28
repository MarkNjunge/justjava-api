import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "../../payments/models/PaymentMethod";
import { OrderPaymentStatus } from "../models/OrderPaymentStatus";
import { OrderStatus } from "../models/OrderStatus";
import { OrderItemDto } from "./OrderItem.dto";

export class OrderDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  additionalComments: string;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  datePlaced: number;

  @ApiProperty({ enum: OrderStatus })
  status: string;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: string;

  @ApiProperty({ enum: OrderPaymentStatus })
  paymentStatus: string;

  @ApiProperty({ nullable: true })
  userId: number;

  @ApiProperty({ nullable: true })
  addressId: number;

  @ApiProperty({ isArray: true, type: OrderItemDto })
  items: OrderItemDto[];
}
