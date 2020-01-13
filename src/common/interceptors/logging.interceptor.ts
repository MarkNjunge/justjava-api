import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CustomLogger } from "../CustomLogger";
import { FastifyReply, FastifyRequest } from "fastify";
import { ServerResponse, IncomingMessage } from "http";
import * as moment from "moment";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logger: CustomLogger;

  constructor() {
    this.logger = new CustomLogger("ROUTE");
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest<IncomingMessage>>();
    const response = ctx.getResponse<FastifyReply<ServerResponse>>();

    const requestTime = moment().valueOf();

    // Add request time to params to be used in exception filters
    request.params.requestTime = requestTime;

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.logRoute(request, response.res.statusCode, requestTime),
        ),
      );
  }
}
