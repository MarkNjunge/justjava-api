import { Injectable } from "@nestjs/common";
import { config } from "../../../utils/Config";
import { CustomLogger } from "../../../utils/logging/CustomLogger";
import { Bucket, Storage } from "@google-cloud/storage";
import * as path from "path";
import * as fs from "fs";
import StoredFileDto from "./dto/StoredFile.dto";
import * as fileSize from "filesize";

@Injectable()
export class FilesService {
  private logger = new CustomLogger("FilesService");
  private imagesBucket: Bucket;

  async connect() {
    try {
      const serviceAccountKeyPath = path.resolve("./service-account-key.json");
      if (!fs.existsSync(serviceAccountKeyPath)) {
        this.logger.error(
          `Service account file was expected at '${serviceAccountKeyPath} but was not found`);

        return;
      }

      const storage = new Storage({
        projectId: config.google.projectId,
        keyFilename: serviceAccountKeyPath,
      });
      this.imagesBucket = storage.bucket(config.google.imagesBucketName);
    } catch (e) {
      this.logger.error(e.message, e);
    }
  }

  async uploadFile(fileBuffer: Buffer, filePath: string): Promise<StoredFileDto> {
    return new Promise((resolve, reject) => {
      const blob = this.imagesBucket.file(filePath);
      const blobStream = blob.createWriteStream();

      blobStream.on("error", err => {
        reject(err);
      });

      blobStream.on("finish", () => {
        let publicUrl = `https://storage.googleapis.com/${this.imagesBucket.name}/${blob.name}`;
        if (this.imagesBucket.name.includes(".")) {
          publicUrl = `https://${this.imagesBucket.name}/${blob.name}`;
        }
        this.logger.debug(`Finished uploading to ${filePath}`);
        resolve({
          name: blob.name,
          bucket: this.imagesBucket.name,
          publicUrl,
        });
      });

      this.logger.debug(`Uploading ${fileSize(fileBuffer.length)} file to ${filePath}`);
      blobStream.end(fileBuffer);
    });
  }

  async listFiles(): Promise<StoredFileDto[]> {
    const bucket = this.imagesBucket;
    const [files] = await bucket.getFiles();

    return files.filter(f => !f.name.endsWith("/")).map(f => {
      let publicUrl = `https://storage.googleapis.com/${bucket.name}/${f.name}`;
      if (this.imagesBucket.name.includes(".")) {
        publicUrl = `https://${bucket.name}/${f.name}`;
      }

      return { name: f.name, bucket: bucket.name, publicUrl };
    });

  }
}
