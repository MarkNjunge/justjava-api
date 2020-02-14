import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetPasswordTokenDto {
  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  token: string;
}
