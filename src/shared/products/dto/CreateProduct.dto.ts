import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsEnum,
  Min,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { ProductType, ProductStatus } from "./Product.dto";
import { CreateProductChoiceDto } from "./CreateProductChoice.dto";
import { Type } from "class-transformer";

export class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @Min(0, { message: "Products can't sell for a less than 0" })
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsNotEmpty()
  @IsEnum(ProductType)
  @ApiProperty({ enum: ProductType })
  type: string;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  @ApiProperty({ enum: ProductStatus })
  status: string;

  @IsOptional()
  @ApiProperty({ type: [CreateProductChoiceDto], required: false })
  @ValidateNested({ each: true })
  @Type(() => CreateProductChoiceDto)
  choices: CreateProductChoiceDto[];
}
