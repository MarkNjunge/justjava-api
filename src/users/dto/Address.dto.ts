import { ApiModelProperty } from "@nestjs/swagger";

export class AddressDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  streetAddress: string;

  @ApiModelProperty({ nullable: true })
  deliveryInstructions: string;

  @ApiModelProperty()
  latLng: string;
}
