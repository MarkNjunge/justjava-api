import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IncomingMessage } from "http";
import { FastifyRequest } from "fastify";
import { RedisService } from "../../shared/redis/redis.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest<IncomingMessage> = context
      .switchToHttp()
      .getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(
    request: FastifyRequest<IncomingMessage>,
  ): Promise<boolean> {
    // Skip authentication on certain urls
    // Prevents needing to specify the guard on all other endpoints in the controller
    const ignoredUrls = ["/orders/verify"];
    if (ignoredUrls.includes(request.req.url)) {
      return true;
    }

    const sessionId = request.headers["session-id"];

    if (!sessionId) {
      throw new UnauthorizedException({
        message: "session-id header is required",
      });
    }

    const session = await this.redisService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException({ message: "Invalid session-id" });
    }

    request.params.session = session;
    await this.redisService.updateLastUseDate(session);

    return true;
  }
}
