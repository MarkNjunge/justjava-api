import { FastifyReply, FastifyRequest } from "fastify";
import { ServerResponse, IncomingMessage } from "http";

export function requestTimeMiddleware(
  request: FastifyRequest,
  _response: FastifyReply,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function,
) {
  const requestTime = Date.now();
  request.headers["x-request-time"] = requestTime.toString();
  next();
}
