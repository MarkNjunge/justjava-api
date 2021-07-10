import * as dayjs from "dayjs";
import * as crypto from "crypto";
import { FastifyReply, FastifyRequest } from "fastify";

export function requestHeadersMiddleware(
  request: FastifyRequest,
  _response: FastifyReply,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function,
) {
  const requestTime = dayjs().valueOf();
  request.headers["x-request-time"] = requestTime.toString();
  request.headers["x-correlation-id"] = crypto.randomBytes(8).toString("hex");
  next();
}
