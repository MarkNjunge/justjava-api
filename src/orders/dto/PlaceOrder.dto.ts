import { ApiModelProperty } from "@nestjs/swagger";
import {
  ValidateNested,
  IsOptional,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { PlaceOrderItemDto } from "./PlaceOrderItem.dto";
import { PaymentMethod } from "../models/PaymentMethod";

export class PlaceOrderDto {
  @ApiModelProperty()
  @IsNotEmpty()
  addressId: number;

  @ApiModelProperty({ required: false })
  @IsOptional()
  additionalComments: string;

  @ApiModelProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiModelProperty({ isArray: true, type: PlaceOrderItemDto })
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemDto)
  items: PlaceOrderItemDto[];
}
