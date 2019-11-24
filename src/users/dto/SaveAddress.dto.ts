import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class SaveAddressDto {
  @IsNotEmpty()
  @ApiModelProperty()
  streetAddress: string;

  @IsOptional()
  @ApiModelProperty()
  deliveryInstructions: string;

  @IsNotEmpty()
  @ApiModelProperty()
  latLng: string;
}
