import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateFcmTokenDto {
  @IsNotEmpty()
  @ApiModelProperty()
  fcmToken: string;
}
