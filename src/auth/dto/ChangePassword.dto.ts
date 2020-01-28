import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiModelProperty()
  currentPassword: string;

  @IsNotEmpty()
  @ApiModelProperty()
  newPassword: string;
}
