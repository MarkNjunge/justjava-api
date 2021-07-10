import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FastifyRequest } from "fastify";
import { RedisService } from "../modules/shared/redis/redis.service";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly redisService: RedisService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest();
    const allowNoAuth = this.reflector.get<boolean>("allowNoAuth", context.getHandler());

    return this.validateRequest(request, allowNoAuth);
  }

  async validateRequest(request: FastifyRequest, allowNoAuth: boolean): Promise<boolean> {
    const sessionId = request.headers["session-id"] as string;

    if (!sessionId && !allowNoAuth) {
      throw new UnauthorizedException({
        message: "session-id header is required",
      });
    }

    const session = await this.redisService.getSession(sessionId);
    if (!session && !allowNoAuth) {
      throw new UnauthorizedException({ message: "Invalid session-id" });
    }

    if (session) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      request.params.session = session;
      request.headers["x-user-id"] = session.userId.toString();
      await this.redisService.updateLastUseDate(session);
    }

    return true;
  }
}
