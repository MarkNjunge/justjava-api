import { Controller, Post, Req, Get, UseGuards, BadRequestException } from "@nestjs/common";
import {
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiSecurity,
} from "@nestjs/swagger";
import { ApiImplicitFormData } from "../../../decorators/api-imlicit-form-data.decorator";
import { ImagesService } from "./images.service";
import { AdminGuard } from "../../../guards/admin.guard";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { config } from "../../../utils/Config";
import { UploadImageDto } from "./dto/UploadImage.dto";
import UploadImageResponseDto from "./dto/UploadImageResponse.dto";
import { ClassConstructor } from "class-transformer/types/interfaces";
import StoredFileDto from "../../shared/files/dto/StoredFile.dto";

@Controller("admin/images")
@ApiTags("images")
@UseGuards(AdminGuard)
@ApiSecurity("admin-key")
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Post("/upload")
  @ApiOperation({ summary: "Upload an image" })
  @ApiConsumes("multipart/form-data")
  @ApiImplicitFormData({ name: "name", required: true, type: String })
  @ApiImplicitFormData({ name: "path", required: true, type: String })
  @ApiImplicitFormData({ name: "image", required: true, type: "file" })
  @ApiResponse({ status: 201, type: UploadImageResponseDto })
  async upload(@Req() req): Promise<UploadImageResponseDto> {
    const dto = await this.parseFileBody<UploadImageDto>(req);

    await this.validateOrThrow(UploadImageDto, dto);

    const publicUrl = await this.imageService.upload(dto);

    return { publicUrl };
  }

  @Get("/")
  @ApiOperation({ summary: "Get all images uploaded" })
  @ApiResponse({ status: 201, type: StoredFileDto, isArray: true })
  async getAllResource(): Promise<StoredFileDto[]> {
    return this.imageService.getAllResources();
  }

  async parseFileBody<T>(req): Promise<T> {
    const body = {};
    for (const key of Object.keys(req.body)) {
      const field = req.body[key];

      if (field.mimetype) {
        delete field.fields;
        if (field.mimetype) {
          const buffer = await field.toBuffer();

          body[key] = {
            filename: field.filename,
            mimetype: field.mimetype,
            size: buffer.length,
            buffer,
          };
        }
      } else {
        body[key] = field.value;
      }
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return body;
  }

  async validateOrThrow<T>(cls: ClassConstructor<T>, dto) {
    const object = plainToClass(cls, dto);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const validationErrors = await validate(object, {
      forbidUnknownValues: config.validatorForbidUnknown,
      whitelist: config.validatorForbidUnknown,
      forbidNonWhitelisted: config.validatorForbidUnknown,
    });

    const errors = validationErrors.map(error => ({
      property: error.property,
      constraints: Object.values(error.constraints),
    }));

    if (errors.length > 0) {
      const errorProperties = errors.map(e => e.property).join(",");
      throw new BadRequestException({
        message: `Validation errors with properties [${errorProperties}]`,
        meta: errors,
      });
    }
  }
}
