import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";
import { Logger } from "../utils/logging/Logger";
import { ApiResponseDto } from "../modules/shared/dto/ApiResponse.dto";
import { LogEnrichment } from "../decorators/log-enrichment.decorator";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger: Logger;

  constructor() {
    this.logger = new Logger("AllExceptionsFilter");
  }

  catch(e: HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // Get the location where the error was thrown from to use as a logging tag
    const stackTop = e.stack.split("\n")[1].split("at ")[1].split(" ")[0];

    // Get the correct http status
    const status =
      e instanceof HttpException ?
        e.getStatus() :
        HttpStatus.INTERNAL_SERVER_ERROR;
    response.statusCode = status;
    const message = e.message;
    const logMessage: ApiResponseDto = {
      httpStatus: status,
      message,
    };

    if (e instanceof HttpException && (e.getResponse() as any).meta) {
      logMessage.meta = (e.getResponse() as any).meta;
    }

    const meta = { stacktrace: e.stack };
    const enrichment: LogEnrichment = {
      correlationId: request.headers["x-correlation-id"].toString(),
      userId: request.headers["x-user-id"]?.toString(),
    };
    this.logger.error(message, { context: stackTop, enrichment, meta });
    this.logger.logRoute(request, response, { ...logMessage });

    response.status(status).send({
      ...logMessage,
    });
  }
}
