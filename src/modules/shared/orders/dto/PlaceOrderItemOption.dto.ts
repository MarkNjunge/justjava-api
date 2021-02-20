import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PlaceOrderItemOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  choiceId: number;

  @ApiProperty()
  @IsNotEmpty()
  optionId: number;
}
