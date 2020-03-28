import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
