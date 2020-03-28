import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";
import { VerifyOrderItemDto } from "./VerifyOrderItem.dto";

export class VerifyOrderDto {
  @ApiProperty({ isArray: true, type: VerifyOrderItemDto })
  @ValidateNested({ each: true })
  @Type(() => VerifyOrderItemDto)
  items: VerifyOrderItemDto[];
}
