import { ApiProperty } from "@nestjs/swagger";

export class OrderItemOptionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  choiceId: number;

  @ApiProperty()
  choiceName: string;

  @ApiProperty()
  optionId: number;

  @ApiProperty()
  optionName: string;

  @ApiProperty()
  optionPrice: number;
}
