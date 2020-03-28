import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateFcmTokenDto {
  @IsNotEmpty()
  @ApiProperty()
  fcmToken: string;
}
