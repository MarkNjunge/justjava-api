import * as dayjs from "dayjs";
import { FastifyReply, FastifyRequest } from "fastify";

export function requestTimeMiddleware(
  request: FastifyRequest,
  _response: FastifyReply,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function,
) {
  const requestTime = dayjs().valueOf();
  request.headers["x-request-time"] = requestTime.toString();
  next();
}
