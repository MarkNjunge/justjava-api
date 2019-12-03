import { ApiModelProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiModelProperty()
  @IsOptional()
  firstName: string;

  @ApiModelProperty()
  @IsOptional()
  lastName: string;

  @ApiModelProperty()
  @IsOptional()
  email: string;

  @ApiModelProperty()
  @IsOptional()
  mobileNumber: string;
}
