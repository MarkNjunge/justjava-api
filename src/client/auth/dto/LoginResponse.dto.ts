import { ApiModelProperty } from "@nestjs/swagger";
import { UserDto } from "../../../users/dto/User.dto";
import { SessionDto } from "./Session.dto";

export class LoginResponseDto {
  @ApiModelProperty()
  user: UserDto;

  @ApiModelProperty()
  session: SessionDto;
}
