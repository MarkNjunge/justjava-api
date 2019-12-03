import { ApiModelProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiModelProperty({ required: false })
  @IsOptional()
  firstName: string;

  @ApiModelProperty({ required: false })
  @IsOptional()
  lastName: string;

  @ApiModelProperty({ required: false })
  @IsOptional()
  email: string;

  @ApiModelProperty({ required: false })
  @IsOptional()
  mobileNumber: string;
}
