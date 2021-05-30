import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import UploadFileDto from "./UploadFile.dto";
import { IsImageFile } from "../../../../utils/validation/IsImageFile";
import { IsSmallerThan } from "../../../../utils/validation/IsSmallerThan";

export class UploadImageDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  path: string;

  @IsNotEmpty()
  @IsImageFile()
  @IsSmallerThan(5 * 1024 * 1024) // 5MB
  @ApiProperty()
  image: UploadFileDto;
}
