import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class InitiatePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  cardNo: string;

  @ApiProperty()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty()
  @IsNotEmpty()
  expiryMonth: string;

  @ApiProperty()
  @IsNotEmpty()
  expiryYear: string;

  @ApiProperty()
  @IsNotEmpty()
  billingZip: string;

  @ApiProperty()
  @IsNotEmpty()
  billingCity: string;

  @ApiProperty()
  @IsNotEmpty()
  billingAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  billingState: string;

  @ApiProperty()
  @IsNotEmpty()
  billingCountry: string;
}
