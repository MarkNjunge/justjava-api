import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SaveAddressDto {
  @IsNotEmpty()
  @ApiModelProperty()
  streetAddress: string;

  @IsOptional()
  @ApiModelProperty({ required: false })
  deliveryInstructions: string;

  @IsNotEmpty()
  @ApiModelProperty()
  latLng: string;
}
