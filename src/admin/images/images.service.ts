import { Injectable, NotFoundException } from "@nestjs/common";
import * as cloudinary from "cloudinary";
import { UploadImageDto } from "./dto/UploadImage.dto";
import { config } from "../../common/Config";
import { CloudinaryInfoDto } from "./dto/CloudinaryInfo.dto";

@Injectable()
export class ImagesService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
    });
  }

  async upload(image, dto: UploadImageDto): Promise<any> {
    if (!dto.folder) {
      dto.folder = "";
    }

    const uploadOptions = {
      public_id: dto.name,
      folder: `justjava/${dto.folder}`,
      tags: dto.tags.split(","),
    };

    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(image.data);
    });
  }

  async getAllResources(): Promise<CloudinaryInfoDto[]> {
    const res = await cloudinary.v2.api.resources({
      type: "upload",
      prefix: "justjava",
    });

    return res.resources.map(r => ({
      url: r.secure_url,
      publicId: r.public_id,
    }));
  }

  async getResourceByPublicId(publicId: string): Promise<CloudinaryInfoDto> {
    try {
      const res = await cloudinary.v2.api.resource(publicId);

      return {
        url: res.secure_url,
        publicId: res.public_id,
        tags: res.tags,
      };
    } catch (e) {
      if (e.error.http_code) {
        throw new NotFoundException({ message: e.error.message });
      } else {
        throw new Error(e.error.message);
      }
    }
  }
}
