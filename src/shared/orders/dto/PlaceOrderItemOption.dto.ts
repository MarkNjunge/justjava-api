import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class PlaceOrderItemOptionDto {
  @ApiModelProperty()
  @IsNotEmpty()
  choiceId: number;

  @ApiModelProperty()
  @IsNotEmpty()
  optionId: number;
}
