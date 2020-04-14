import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyOrderItemOptionDto {
  @ApiProperty()
  @IsNotEmpty()
  choiceId: number;

  @ApiProperty()
  @IsNotEmpty()
  optionId: number;

  @ApiProperty()
  @IsNotEmpty()
  optionPrice: number;
}
