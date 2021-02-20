import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../models/OrderStatus";
import { IsNotEmpty, IsEnum } from "class-validator";

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
