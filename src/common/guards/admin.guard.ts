import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IncomingMessage } from "http";
import { FastifyRequest } from "fastify";
import { config } from "../Config";
import { ApiException } from "../ApiException";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest<
      IncomingMessage
    > = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

async function validateRequest(
  request: FastifyRequest<IncomingMessage>,
): Promise<boolean> {
  const adminKey = request.headers["admin-key"];

  if (adminKey !== config.adminKey) {
    throw new ApiException(HttpStatus.FORBIDDEN, "Invalid admin key");
  }

  return true;
}
