import { ApiProperty } from "@nestjs/swagger";

export class AddressDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty({ nullable: true })
  deliveryInstructions: string;

  @ApiProperty()
  latLng: string;
}
