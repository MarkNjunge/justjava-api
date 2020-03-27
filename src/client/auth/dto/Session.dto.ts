import { ApiModelProperty } from "@nestjs/swagger";

export class SessionDto {
  @ApiModelProperty()
  userId: number;

  @ApiModelProperty()
  sessionId: string;

  @ApiModelProperty()
  lastUseDate: number;

  constructor(userId: number, sessionId: string, lastUseDate: number) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.lastUseDate = lastUseDate;
  }
}
