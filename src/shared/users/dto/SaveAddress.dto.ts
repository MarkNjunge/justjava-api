import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SaveAddressDto {
  @IsNotEmpty()
  @ApiProperty()
  streetAddress: string;

  @IsOptional()
  @ApiProperty({ required: false })
  deliveryInstructions: string;

  @IsNotEmpty()
  @ApiProperty()
  latLng: string;
}
