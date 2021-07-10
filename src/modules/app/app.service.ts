import { Injectable } from "@nestjs/common";
import { Logger } from "../../utils/logging/Logger";

@Injectable()
export class AppService {
  logger: Logger = new Logger("AppService");

  getHello(): string {
    return "JustJava-api";
  }
}
