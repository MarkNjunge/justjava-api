import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PlaceOrderItemOptionDto } from "./PlaceOrderItemOption.dto";

export class PlaceOrderItemDto {
  @ApiModelProperty()
  @IsNotEmpty()
  productId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiModelProperty({ isArray: true, type: PlaceOrderItemOptionDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemOptionDto)
  options: PlaceOrderItemOptionDto[];
}
