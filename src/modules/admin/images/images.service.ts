import { Injectable } from "@nestjs/common";
import { UploadImageDto } from "./dto/UploadImage.dto";
import { FilesService } from "../../shared/files/files.service";
import StoredFileDto from "../../shared/files/dto/StoredFile.dto";
import { Logger } from "../../../utils/logging/Logger";

@Injectable()
export class ImagesService {
  private logger = new Logger("ImagesService")

  constructor(private readonly filesService: FilesService) {
  }

  async upload(dto: UploadImageDto): Promise<string> {
    this.logger.debug(`Uploading image ${dto.name} to ${dto.path}`);
    const extension = dto.image.filename.split(".")[dto.image.filename.split(".").length - 1];
    const filePath = `${dto.path}/${dto.name}.${extension}`.replace(/\/\/+/, "/");

    const res = await this.filesService.uploadFile(dto.image.buffer, filePath);

    return res.publicUrl;
  }

  async getAllResources(): Promise<StoredFileDto[]> {
    return this.filesService.listFiles();
  }
}
