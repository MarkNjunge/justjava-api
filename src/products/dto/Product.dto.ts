import { ApiModelProperty } from "@nestjs/swagger";

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
  @ApiModelProperty()
  id: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  slug: string;

  @ApiModelProperty()
  description: string;

  @ApiModelProperty()
  price: number;

  @ApiModelProperty()
  image: string;

  @ApiModelProperty({ enum: ProductType })
  type: string;

  @ApiModelProperty({ enum: ProductStatus })
  status: string;

  @ApiModelProperty()
  createdAt: number;
}
