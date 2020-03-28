import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { VerifyOrderItemOptionDto } from "./VerifyOrderItemOption.dto";
import { Type } from "class-transformer";

export class VerifyOrderItemDto {
  @ApiModelProperty()
  @IsNotEmpty()
  index: number;

  @ApiModelProperty()
  @IsNotEmpty()
  productId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  productBasePrice: number;

  @ApiModelProperty({ isArray: true, type: VerifyOrderItemOptionDto })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => VerifyOrderItemOptionDto)
  options: VerifyOrderItemOptionDto[];
}
