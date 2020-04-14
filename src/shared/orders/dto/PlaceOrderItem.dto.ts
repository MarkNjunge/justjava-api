import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PlaceOrderItemOptionDto } from "./PlaceOrderItemOption.dto";

export class PlaceOrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ isArray: true, type: PlaceOrderItemOptionDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PlaceOrderItemOptionDto)
  options: PlaceOrderItemOptionDto[];
}
