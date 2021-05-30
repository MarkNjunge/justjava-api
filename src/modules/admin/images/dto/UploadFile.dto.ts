export default class UploadFileDto {
  filename: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}
