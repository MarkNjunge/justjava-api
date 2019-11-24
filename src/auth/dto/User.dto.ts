import { ApiModelProperty } from "@nestjs/swagger";
import { SignInMethod } from "../models/SignInMethod";

export class UserDto {
  @ApiModelProperty()
  id: number;

  @ApiModelProperty()
  firstName: string;

  @ApiModelProperty()
  lastName: string;

  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  mobileNumber: string;

  @ApiModelProperty({ enum: SignInMethod })
  signInMethod: string;

  @ApiModelProperty()
  createdAt: number;
}
