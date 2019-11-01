import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsEnum, Min } from "class-validator";
import { ProductType, ProductStatus } from "./Product.dto";

export class CreateProductDto {
  @IsNotEmpty()
  @ApiModelProperty()
  name: string;

  @IsNotEmpty()
  @ApiModelProperty()
  description: string;

  @IsNotEmpty()
  @Min(0, { message: "Products can't sell for a less than 0" })
  @ApiModelProperty()
  price: number;

  @IsNotEmpty()
  @ApiModelProperty()
  image: string;

  @IsNotEmpty()
  @IsEnum(ProductType)
  @ApiModelProperty({ enum: ProductType })
  type: string;

  @IsNotEmpty()
  @IsEnum(ProductStatus)
  @ApiModelProperty({ enum: ProductStatus })
  status: string;
}
