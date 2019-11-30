import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyOrderItemOptionDto {
  @ApiModelProperty()
  @IsNotEmpty()
  choiceId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  optionId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  optionPrice: number;
}
