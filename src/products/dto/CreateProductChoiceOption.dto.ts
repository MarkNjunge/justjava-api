import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductChoiceOptionDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @IsOptional()
  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @ApiModelProperty()
  price: number;
}
