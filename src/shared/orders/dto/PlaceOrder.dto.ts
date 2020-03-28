import { ApiProperty } from "@nestjs/swagger";
import {
  ValidateNested,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { PlaceOrderItemDto } from "./PlaceOrderItem.dto";
import { PaymentMethod } from "../../payments/models/PaymentMethod";

export class PlaceOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  addressId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  additionalComments: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ isArray: true, type: PlaceOrderItemDto })
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDto)
  items: PlaceOrderItemDto[];
}
