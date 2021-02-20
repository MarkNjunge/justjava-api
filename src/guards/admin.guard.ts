import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { IncomingMessage } from "http";
import { FastifyRequest } from "fastify";
import { config } from "../utils/Config";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: FastifyRequest = context
      .switchToHttp()
      .getRequest();
    return validateRequest(request);
  }
}

async function validateRequest(
  request: FastifyRequest,
): Promise<boolean> {
  const adminKey = request.headers["admin-key"];

  if (adminKey !== config.adminKey) {
    throw new ForbiddenException({ message: "Invalid admin key" });
  }

  return true;
}
