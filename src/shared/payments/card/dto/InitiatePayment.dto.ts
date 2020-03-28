import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InitiatePaymentDto {
  @ApiModelProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiModelProperty()
  @IsNotEmpty()
  cardNo: string;

  @ApiModelProperty()
  @IsNotEmpty()
  cvv: string;

  @ApiModelProperty()
  @IsNotEmpty()
  expiryMonth: string;

  @ApiModelProperty()
  @IsNotEmpty()
  expiryYear: string;

  @ApiModelProperty()
  @IsNotEmpty()
  billingZip: string;

  @ApiModelProperty()
  @IsNotEmpty()
  billingCity: string;

  @ApiModelProperty()
  @IsNotEmpty()
  billingAddress: string;

  @ApiModelProperty()
  @IsNotEmpty()
  billingState: string;

  @ApiModelProperty()
  @IsNotEmpty()
  billingCountry: string;
}
