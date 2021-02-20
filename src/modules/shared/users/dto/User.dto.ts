import { ApiProperty } from "@nestjs/swagger";
import { SignInMethod } from "../../../client/auth/models/SignInMethod";
import { AddressDto } from "./Address.dto";

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  mobileNumber: string;

  @ApiProperty({ enum: SignInMethod })
  signInMethod: string;

  @ApiProperty()
  createdAt: number;

  @ApiProperty({ type: AddressDto, isArray: true })
  addresses: AddressDto[];
}
