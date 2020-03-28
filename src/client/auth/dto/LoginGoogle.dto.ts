import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginGoogleDto {
  @IsNotEmpty()
  @ApiProperty()
  idToken: string;
}
