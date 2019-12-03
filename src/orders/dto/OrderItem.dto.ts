import { ApiModelProperty } from "@nestjs/swagger";
import { OrderItemOptionDto } from "./OrderItemOption.dto";

export class OrderItemDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  productId: number;

  @ApiModelProperty()
  productName: string;

  @ApiModelProperty()
  productBasePrice: number;

  @ApiModelProperty()
  totalPrice: number;

  @ApiModelProperty()
  quantity: number;

  @ApiModelProperty({ isArray: true, type: OrderItemOptionDto })
  option: OrderItemOptionDto[];
}
