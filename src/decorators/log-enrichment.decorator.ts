import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const LogEnrichment = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): LogEnrichment => {
    const request = ctx.switchToHttp().getRequest();

    return {
      correlationId: request.headers["x-correlation-id"],
      userId: request.headers["x-user-id"],
    };
  },
);

export interface LogEnrichment {
  correlationId: string;
  userId: string;
}
