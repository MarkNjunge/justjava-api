import { LoggerService } from "@nestjs/common";
import * as winston from "winston";
import * as dayjs from "dayjs";
import { config } from "../Config";
import { FastifyRequest, FastifyReply } from "fastify";
import { DatadogTransport } from "./DatadogTransport";

export class CustomLogger implements LoggerService {
  constructor(private readonly name: string = "Application") {}

  log(message: string, name?: string, data?: any) {
    const tag = name || this.name;
    winston.info({ message: `[${tag}] ${message}`, data });
  }

  error(message: string, name?: string, data?: any) {
    const tag = name || this.name;
    winston.error({ message: `[${tag}] ${message}`, data });
  }

  warn(message: string, name?: string, data?: any) {
    const tag = name || this.name;
    winston.warn({ message: `[${tag}] ${message}`, data });
  }

  debug(message: string, name?: string, data?: any) {
    const tag = name || this.name;
    winston.debug({ message: `[${tag}] ${message}`, data });
  }

  verbose(message: string, name?: string, data?: any) {
    const tag = name || this.name;
    winston.verbose({ message: `[${tag}] ${message}`, data });
  }

  // TODO Shorten
  // eslint-disable-next-line max-lines-per-function
  logRoute(
    request: FastifyRequest,
    response: FastifyReply,
    responseBody?: any,
  ) {
    const statusCode = response.statusCode;
    const method = request.method;
    const url = request.url;
    const tag = "ROUTE";
    const requestTime = parseInt(request.headers["x-request-time"] as string);
    const requestTimeISO = dayjs(requestTime).toISOString();
    const duration = dayjs().valueOf() - requestTime;

    let data: any = {
      tag,
      request: {
        url,
        method,
        requestTime: requestTimeISO,
        ip: request.headers["x-real-ip"] || request.ip,
        headers: request.headers,
        query: Object.assign({}, request.query),
        body: Object.assign({}, request.body),
      },
      response: {
        duration,
        statusCode,
        headers: response.getHeaders(),
        body: responseBody,
      },
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (request.params.session) {
      data = {
        ...data,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userId: request.params.session.userId,
      };
    }

    const message = `${method} ${url} - ${statusCode} - ${duration}ms`;

    winston.info({ message: `[${tag}] ${message}`, data });
  }
}

export function initializeWinston() {
  const { combine, timestamp, printf, colorize } = winston.format;

  const myFormat = printf(({ level, message, logTimestamp }) => {
    const m = dayjs(logTimestamp);
    const formattedTimestamp = m.format(config.logging.timestampFormat);

    return `${formattedTimestamp} | ${level}: ${message}`;
  });

  winston.configure({
    level: "debug",
    format: combine(timestamp(), myFormat),
    transports: [
      new winston.transports.Console({
        format: combine(myFormat, colorize({ all: true })),
      }),
    ],
  });

  if (Boolean(config.datadog.enabled) === true) {
    winston.add(new DatadogTransport({}));
  }
}
