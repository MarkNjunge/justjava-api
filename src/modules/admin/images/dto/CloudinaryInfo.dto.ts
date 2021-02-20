import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CloudinaryInfoDto {
  @IsNotEmpty()
  @ApiProperty()
  url: string;

  @IsNotEmpty()
  @ApiProperty()
  publicId: string;

  @IsNotEmpty()
  @ApiProperty()
  tags: string[];
}
