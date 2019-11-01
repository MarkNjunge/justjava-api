import { Controller, Post, Req, Get, Param, UseGuards } from "@nestjs/common";
import {
  ApiOperation,
  ApiConsumes,
  ApiImplicitHeader,
  ApiResponse,
} from "@nestjs/swagger";
import { UploadImageDto } from "./dto/UploadImage.dto";
import { ApiImplicitFormData } from "../common/decorators/api-imlicit-form-data.decorator";
import { ImagesService } from "./images.service";
import { CloudinaryInfoDto } from "./dto/CloudinaryInfo.dto";
import { AdminGuard } from "src/common/guards/admin.guard";

@Controller("images")
@UseGuards(AdminGuard)
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post("/upload")
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiOperation({ title: "Upload an image to Cloudinary" })
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
  @ApiResponse({ status: 201, type: CloudinaryInfoDto })
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
  @ApiOperation({ title: "Get all images on Cloudinary" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 201, type: CloudinaryInfoDto, isArray: true })
  async getAllResource(): Promise<CloudinaryInfoDto[]> {
    return this.imageService.getAllResources();
  }

  @Get("/:publicId")
  @ApiOperation({ title: "Get a specific image on Cloudinary" })
  @ApiImplicitHeader({ name: "admin-key" })
  @ApiResponse({ status: 201, type: CloudinaryInfoDto })
  async getResourceByPublicId(
    @Param("publicId") publicId: string,
  ): Promise<CloudinaryInfoDto> {
    return this.imageService.getResourceByPublicId(publicId);
  }
}
