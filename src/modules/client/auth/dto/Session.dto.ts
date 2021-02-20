import { ApiProperty } from "@nestjs/swagger";

export class SessionDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  lastUseDate: number;

  constructor(userId: number, sessionId: string, lastUseDate: number) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.lastUseDate = lastUseDate;
  }
}
