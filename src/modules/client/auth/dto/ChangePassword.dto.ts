import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty()
  currentPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
