import { ApiProperty } from "@nestjs/swagger";
import { OrderItemOptionDto } from "./OrderItemOption.dto";

export class OrderItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  productBasePrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ isArray: true, type: OrderItemOptionDto })
  option: OrderItemOptionDto[];
}
