import { NestFactory } from "@nestjs/core";
import { Logger, initializeWinston } from "./utils/logging/Logger";
import { AppModule } from "./modules/app/app.module";
import { AllExceptionsFilter } from "./filters/all-exceptions-filter";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { ValidationPipe } from "./pipes/validation.pipe";
import { config } from "./utils/Config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import * as fastifyRateLimit from "fastify-rate-limit";
import { RedisService } from "./modules/shared/redis/redis.service";
import { NotificationsService } from "./modules/shared/notifications/notifications.service";
import { requestHeadersMiddleware } from "./middleware/request-headers.middleware";
import { SetCookiesInterceptor } from "./interceptors/set-cookies.interceptor";
import { default as helmet } from "fastify-helmet";
import * as axios from "axios";
import * as fs from "fs";
import * as path from "path";
import { FilesService } from "./modules/shared/files/files.service";
import * as fastifyMultipart from "fastify-multipart";
import { ApplicationLogger } from "./utils/logging/ApplicationLogger";

// eslint-disable-next-line no-console
bootstrap().catch(e => console.error(e));

// TODO Shorten
// eslint-disable-next-line max-lines-per-function
async function bootstrap() {
  initializeWinston();
  const logger = new Logger("Application");
  logger.info("****** Starting API ******");

  await downloadServiceAccountKey(logger);

  const fastifyAdapter = new FastifyAdapter({ trustProxy: true });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: process.env.NODE_ENV === "production" ?
        false :
        new ApplicationLogger(),
    },
  );
  await app.register(fastifyMultipart.default, { attachFieldsToBody: true });

  await enablePlugins(app);
  initializeSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new SetCookiesInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(requestHeadersMiddleware);

  const redis = await app.get<RedisService>(RedisService);
  redis.connect();

  const notifications = await app.get<NotificationsService>(
    NotificationsService,
  );
  await notifications.connect();

  const filesService = await app.get<FilesService>(FilesService);
  await filesService.connect();

  await app.listen(config.port, "0.0.0.0").then(() => {
    logger.info(`App running at http://127.0.0.1:${config.port}`);
  });
}

async function downloadServiceAccountKey(logger: Logger) {
  const serviceAccountKeyPath = path.resolve("./service-account-key.json");
  if (fs.existsSync(serviceAccountKeyPath)) {
    logger.info("Service account key already downloaded");

    return;
  }
  logger.info("Downloading service account key");
  const res = await axios.default.get(config.google.serviceAccountKeyUrl);
  fs.writeFileSync(serviceAccountKeyPath, JSON.stringify(res.data));
  logger.info(`Downloaded service account key to '${serviceAccountKeyPath}'`);
}

async function enablePlugins(app: NestFastifyApplication) {
  await app.register(helmet, {
    // A custom Content Security Policy config is required in order for swagger to work
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
        scriptSrc: ["'self'", "https: 'unsafe-inline'"],
      },
    },
  });

  app.enableCors({
    origin: config.corsOrigin,
    methods: config.corsMethods,
    allowedHeaders: config.corsHeaders,
  });

  if (parseBool(config.rateLimit.enabled) === true) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.register(fastifyRateLimit, {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.timeWindow,
    });
  }
}

function initializeSwagger(app: NestFastifyApplication) {
  const options = new DocumentBuilder()
    .setTitle("JustJava API")
    .setDescription("JustJava API")
    .setContact(
      "Mark Njung'e",
      "https://justjava.store",
      "contact@marknjunge.com",
    )
    .addSecurity("session-id", {
      type: "apiKey",
      in: "header",
      name: "session-id",
    })
    .addSecurity("admin-key", {
      type: "apiKey",
      in: "header",
      name: "admin-key",
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);
}

function parseBool(v: string | boolean): boolean {
  return v === "true" || v === true;
}
