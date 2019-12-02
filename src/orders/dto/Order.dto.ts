import { ApiModelProperty } from "@nestjs/swagger";
import { PaymentMethod } from "../models/PaymentMethod";
import { PaymentStatus } from "../models/PaymentStatus";
import { OrderStatus } from "../models/OrderStatus";
import { UserDto } from "../../users/dto/User.dto";
import { AddressDto } from "../../users/dto/Address.dto";
import { OrderItemDto } from "./OrderItem.dto";

export class OrderDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty({ nullable: true })
  additionalComments: string;

  @ApiModelProperty()
  totalPrice: number;

  @ApiModelProperty()
  datePlaced: number;

  @ApiModelProperty({ enum: OrderStatus })
  status: string;

  @ApiModelProperty({ enum: PaymentMethod })
  paymentMethod: string;

  @ApiModelProperty({ enum: PaymentStatus })
  paymentStatus: string;

  @ApiModelProperty()
  user: UserDto;

  @ApiModelProperty()
  address: AddressDto;

  @ApiModelProperty({ isArray: true, type: OrderItemDto })
  items: OrderItemDto[];
}
