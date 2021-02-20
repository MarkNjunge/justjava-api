import { Injectable } from "@nestjs/common";
import { CustomLogger } from "../../utils/logging/CustomLogger";

@Injectable()
export class AppService {
  logger: CustomLogger = new CustomLogger("AppService");

  getHello(): string {
    return "JustJava-api";
  }
}
