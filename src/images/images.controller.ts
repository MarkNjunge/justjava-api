import {
  Controller,
  Post,
  Req,
  Body,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { ApiOperation, ApiConsumes } from "@nestjs/swagger";
import { UploadImageDto } from "./dto/UploadImage.dto";
import { ApiImplicitFormData } from "../common/decorators/api-imlicit-form-data.decorator";
import { ImagesService } from "./images.service";
import { ApiResponseDto } from "../common/dto/ApiResponse.dto";
import { CloudinaryInfoDto } from "./dto/CloudinaryInfo.dto";

@Controller("images")
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post("/upload")
  @ApiOperation({ title: "Upload an images" })
  @ApiConsumes("multipart/form-data")
  @ApiImplicitFormData({ name: "name", required: true, type: String })
  @ApiImplicitFormData({
    name: "tags",
    required: true,
    description: "Comma separated",
    type: String,
  })
  @ApiImplicitFormData({ name: "folder", required: false, type: String })
  @ApiImplicitFormData({ name: "image", required: true, type: "file" })
  async upload(@Req() req): Promise<CloudinaryInfoDto> {
    const imageFile = req.raw.files.image;
    const dto: UploadImageDto = req.body;

    const result = await this.imageService.upload(imageFile, dto);
    return {
      url: result.secure_url,
      publicId: result.public_id,
      tags: result.tags,
    };
  }

  @Get("/")
  async getAllResource(): Promise<CloudinaryInfoDto[]> {
    return this.imageService.getAllResources();
  }

  @Get("/:publicId")
  async getResourceByPublicId(
    @Param("publicId") publicId: string,
  ): Promise<CloudinaryInfoDto> {
    return this.imageService.getResourceByPublicId(publicId);
  }
}
