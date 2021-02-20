import { NestFactory } from "@nestjs/core";
import { CustomLogger, initializeWinston } from "./utils/logging/CustomLogger";
import { AppModule } from "./modules/app/app.module";
import { AllExceptionsFilter } from "./filters/all-exceptions-filter";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { ValidationPipe } from "./pipes/validation.pipe";
import { config } from "./utils/Config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { FastifyAdapter, NestFastifyApplication, } from "@nestjs/platform-fastify";
import * as fastifyRateLimit from "fastify-rate-limit";
import * as fileUpload from "fastify-file-upload";
import { RedisService } from "./modules/shared/redis/redis.service";
import { NotificationsService } from "./modules/shared/notifications/notifications.service";
import { requestTimeMiddleware } from "./middleware/request-time.middleware";
import { SetCookiesInterceptor } from "./interceptors/set-cookies.interceptor";
import { default as helmet } from "fastify-helmet";

bootstrap().catch(e => console.error(e))

async function bootstrap() {
  initializeWinston();
  const logger = new CustomLogger("Application");
  logger.log("****** Starting API ******");

  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fileUpload);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger: process.env.NODE_ENV === "production" ? false : logger,
    },
  );

  await enablePlugins(app)
  initializeSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new SetCookiesInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.use(requestTimeMiddleware);

  const redis = await app.get<RedisService>(RedisService);
  redis.connect();

  const notifications = await app.get<NotificationsService>(
    NotificationsService,
  );
  await notifications.connect();

  await app.listen(config.port, "0.0.0.0").then(() => {
    logger.log(`App running at http://127.0.0.1:${config.port}`);
  });
}

async function enablePlugins(app: NestFastifyApplication){
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

  if (Boolean(config.rateLimit.enabled) === true) {
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
