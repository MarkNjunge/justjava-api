import { IsNotEmpty } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class SignUpDto {
  @IsNotEmpty()
  @ApiModelProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiModelProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiModelProperty()
  email: string;

  @IsNotEmpty()
  @ApiModelProperty()
  mobileNumber: string;

  @IsNotEmpty()
  @ApiModelProperty()
  password: string;
}
