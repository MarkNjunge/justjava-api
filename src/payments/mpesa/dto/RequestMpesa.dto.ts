import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RequestMpesaDto {
  @ApiModelProperty()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiModelProperty()
  @IsNotEmpty()
  orderId: number;
}
