import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, IsCreditCard } from "class-validator";

export class CheckCardDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsCreditCard() // TODO Replace with Luhn ALG. Does not work for verve
  cardNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 2, { message: "expiryMonth must be exactly 2 digits" })
  expiryMonth: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(2, 2, { message: "expiryMonth must be exactly 2 digits" })
  expiryYear: string;

  @ApiProperty()
  @IsNotEmpty()
  orderId: string;
}
