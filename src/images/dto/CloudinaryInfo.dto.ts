import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CloudinaryInfoDto {
  @IsNotEmpty()
  @ApiModelProperty()
  url: string;

  @IsNotEmpty()
  @ApiModelProperty()
  publicId: string;

  @IsNotEmpty()
  @ApiModelProperty()
  tags: string[];
}
