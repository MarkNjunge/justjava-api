import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @ApiModelProperty()
  token: string;

  @IsNotEmpty()
  @ApiModelProperty()
  newPassword: string;
}
