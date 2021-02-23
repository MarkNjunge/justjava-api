import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "../../../shared/users/dto/User.dto";
import { SessionDto } from "./Session.dto";

export class LoginResponseDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  session: SessionDto;
}
