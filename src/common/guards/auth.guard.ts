import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IncomingMessage } from "http";
import { FastifyRequest } from "fastify";
import { RedisService } from "../../redis/redis.service";
import { ApiException } from "../ApiException";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest<
      IncomingMessage
    > = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(
    request: FastifyRequest<IncomingMessage>,
  ): Promise<boolean> {
    const sessionId = request.headers["session-id"];

    if (!sessionId) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        "session-id header is required",
      );
    }

    const session = await this.redisService.getSession(sessionId);
    if (!session) {
      throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid session-id");
    }

    request.params.session = session;
    await this.redisService.updateLastUseDate(session);

    return true;
  }
}
