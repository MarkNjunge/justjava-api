import { ApiProperty } from "@nestjs/swagger";

export class ApiResponseDto {
  @ApiProperty()
  httpStatus: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  meta?: any;

  constructor(httpStatus: number, message: string, meta?: any) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.meta = meta;
  }
}
