import { ApiModelProperty } from "@nestjs/swagger";

export class SessionDto {
  @ApiModelProperty()
  userId: string;

  @ApiModelProperty()
  sessionId: string;

  @ApiModelProperty()
  lastUseDate: number;

  constructor(userId: string, sessionId: string, lastUseDate: number) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.lastUseDate = lastUseDate;
  }
}
