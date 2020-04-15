import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IncomingMessage, ServerResponse } from "http";
import { FastifyReply, FastifyRequest } from "fastify";
import { tap } from "rxjs/operators";

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<FastifyRequest<IncomingMessage>>();
    const response = ctx.getResponse<FastifyReply<ServerResponse>>();

    return next.handle().pipe(
      tap(() => {
        response.header("Set-Cookie", (request as any)._cookies);
      }),
    );
  }
}
