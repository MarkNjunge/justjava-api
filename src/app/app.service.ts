import { Injectable } from "@nestjs/common";
import { CustomLogger } from "../common/CustomLogger";

@Injectable()
export class AppService {
  logger: CustomLogger = new CustomLogger("AppService");

  getHello(): string {
    return "JustJava-api";
  }
}
