import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RequestResetPasswordDto {
  @IsNotEmpty()
  @ApiModelProperty()
  email: string;
}
