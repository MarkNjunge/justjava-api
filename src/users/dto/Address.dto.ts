import { ApiModelProperty } from "@nestjs/swagger";

export class AddressDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  streetAddress: string;

  @ApiModelProperty()
  deliveryInstructions: string;

  @ApiModelProperty()
  latLng: string;
}
