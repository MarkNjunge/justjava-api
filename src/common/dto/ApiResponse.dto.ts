import { ApiModelProperty } from "@nestjs/swagger";

export class ApiResponseDto {
  @ApiModelProperty()
  httpStatus: number;

  @ApiModelProperty()
  message: string;

  @ApiModelProperty()
  meta?: any;

  constructor(httpStatus: number, message: string, meta?: any) {
    this.httpStatus = httpStatus;
    this.message = message;
    this.meta = meta;
  }
}
