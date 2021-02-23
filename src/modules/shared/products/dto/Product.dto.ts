import { ApiProperty } from "@nestjs/swagger";

export enum ProductType {
  COFFEE = "coffee",
}

export enum ProductStatus {
  ENABLED = "enabled",
  DISABLED = "disabled",
  OUT_OF_STOCK = "out_of_stock",
  SOON = "soon",
}

export class ProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;

  @ApiProperty({ enum: ProductType })
  type: string;

  @ApiProperty({ enum: ProductStatus })
  status: string;

  @ApiProperty()
  createdAt: number;
}
