import * as winston from "winston";
import * as dayjs from "dayjs";
import { config } from "../Config";
import { FastifyRequest, FastifyReply } from "fastify";
import { DatadogTransport } from "./DatadogTransport";
import { LogEnrichment } from "../../decorators/log-enrichment.decorator";

export class Logger {
  constructor(private readonly name: string) {}

  info(message: string, extras?: LoggerExtras) {
    const tag = extras?.context ? `${this.name}.${extras.context}` : this.name;
    const data = { tag, ...extras?.enrichment, meta: extras?.meta };

    winston.info({ message: `[${tag}] ${message}`, data });
  }

  error(message: string, extras?: LoggerExtras) {
    const tag = extras?.context ? `${this.name}.${extras.context}` : this.name;
    const data = { tag, ...extras?.enrichment, meta: extras?.meta };

    winston.error({ message: `[${tag}] ${message}`, data });
  }

  warn(message: string, extras?: LoggerExtras) {
    const tag = extras?.context ? `${this.name}.${extras.context}` : this.name;
    const data = { tag, ...extras?.enrichment, meta: extras?.meta };

    winston.warn({ message: `[${tag}] ${message}`, data });
  }

  debug(message: string, extras?: LoggerExtras) {
    const tag = extras?.context ? `${this.name}.${extras.context}` : this.name;
    const data = { tag, ...extras?.enrichment, meta: extras?.meta };

    winston.debug({ message: `[${tag}] ${message}`, data });
  }

  verbose(message: string, extras?: LoggerExtras) {
    const tag = extras?.context ? `${this.name}.${extras.context}` : this.name;
    const data = { tag, ...extras?.enrichment, meta: extras?.meta };

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
    const correlationId = request.headers["x-correlation-id"];

    let data: any = {
      tag,
      correlationId,
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

  if (parseBool(config.datadog.enabled) === true) {
    winston.add(new DatadogTransport({}));
  }
}

function parseBool(v: string | boolean): boolean {
  return v === "true" || v === true;
}

export interface LoggerExtras {
  context?: string,
  enrichment?: LogEnrichment,
  meta?: any
}
