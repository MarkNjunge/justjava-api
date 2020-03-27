import { ApiModelProperty } from "@nestjs/swagger";
import { CreateProductChoiceOptionDto } from "./CreateProductChoiceOption.dto";
import { ValidateNested, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductChoiceDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @IsNotEmpty()
  @ApiModelProperty()
  position: number;

  @IsNotEmpty()
  @Min(0)
  @ApiModelProperty()
  qtyMin: number;

  @IsNotEmpty()
  @Min(-1)
  @ApiModelProperty()
  qtyMax: number;

  @IsNotEmpty()
  @ApiModelProperty({ type: [CreateProductChoiceOptionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProductChoiceOptionDto)
  options: CreateProductChoiceOptionDto[];
}
