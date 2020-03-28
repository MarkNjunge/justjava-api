import { ApiModelProperty } from "@nestjs/swagger";
import { SignInMethod } from "../../../client/auth/models/SignInMethod";
import { AddressDto } from "./Address.dto";

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

  @ApiModelProperty({ type: AddressDto, isArray: true })
  addresses: AddressDto[];
}
