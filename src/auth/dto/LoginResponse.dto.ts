import { ApiModelProperty } from "@nestjs/swagger";
import { UserDto } from "./User.dto";
import { SessionDto } from "./Session.dto";

export class LoginResponseDto {
  @ApiModelProperty()
  user: UserDto;

  @ApiModelProperty()
  session: SessionDto;
}
