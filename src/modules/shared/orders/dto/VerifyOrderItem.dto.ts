import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { VerifyOrderItemOptionDto } from "./VerifyOrderItemOption.dto";
import { Type } from "class-transformer";

export class VerifyOrderItemDto {
  @ApiProperty()
  @IsNotEmpty()
  index: number;

  @ApiProperty()
  @IsNotEmpty()
  productId: number;

  @ApiProperty()
  @IsNotEmpty()
  productBasePrice: number;

  @ApiProperty({ isArray: true, type: VerifyOrderItemOptionDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VerifyOrderItemOptionDto)
  options: VerifyOrderItemOptionDto[];
}
