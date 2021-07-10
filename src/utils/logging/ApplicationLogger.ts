import { LoggerService } from "@nestjs/common";
import { Logger } from "./Logger";

export class ApplicationLogger implements LoggerService {
  private logger = new Logger("NestApplication")

  log(message: any): any {
    this.logger.info(message);
  }

  error(message: any): any {
    this.logger.error(message);
  }

  warn(message: any): any {
    this.logger.warn(message);
  }

  debug?(message: any): any {
    this.logger.debug(message);
  }

  verbose?(message: any): any {
    this.logger.verbose(message);
  }
}
