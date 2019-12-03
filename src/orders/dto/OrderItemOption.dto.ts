import { ApiModelProperty } from "@nestjs/swagger";

export class OrderItemOptionDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  choiceId: number;

  @ApiModelProperty()
  choiceName: string;

  @ApiModelProperty()
  optionId: number;

  @ApiModelProperty()
  optionName: string;

  @ApiModelProperty()
  optionPrice: number;
}
