import { ApiProperty } from "@nestjs/swagger";
import { CreateProductChoiceOptionDto } from "./CreateProductChoiceOption.dto";
import { ValidateNested, IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateProductChoiceDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  position: number;

  @IsNotEmpty()
  @Min(0)
  @ApiProperty()
  qtyMin: number;

  @IsNotEmpty()
  @Min(-1)
  @ApiProperty()
  qtyMax: number;

  @IsNotEmpty()
  @ApiProperty({ type: [CreateProductChoiceOptionDto] })
  @ValidateNested({ each: true })
  @Type(() => CreateProductChoiceOptionDto)
  options: CreateProductChoiceOptionDto[];
}
