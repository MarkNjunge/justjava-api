import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateProductChoiceOptionDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @ApiModelProperty()
  price: number;
}
