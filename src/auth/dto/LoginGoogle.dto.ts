import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginGoogleDto {
  @IsNotEmpty()
  @ApiModelProperty()
  idToken: string;
}
