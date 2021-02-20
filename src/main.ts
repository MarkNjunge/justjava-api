import { NestFactory } from "@nestjs/core";
import { CustomLogger, initializeWinston } from "./common/logging/CustomLogger";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions-filter";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { ValidationPipe } from "./common/pipes/validation.pipe";
import { config } from "./common/Config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import * as fastifyRateLimit from "fastify-rate-limit";
import * as fileUpload from "fastify-file-upload";
import { RedisService } from "./shared/redis/redis.service";
import { NotificationsService } from "./shared/notifications/notifications.service";
import { requestTimeMiddleware } from "./common/middleware/request-time.middleware";
import { SetCookiesInterceptor } from "./common/interceptors/set-cookies.interceptor";
import { default as helmet } from "fastify-helmet";

declare const module: any;

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

  intializeSwagger(app);

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

  if (config.rateLimit.enabled === true) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    app.register(fastifyRateLimit, {
      max: config.rateLimit.max,
      timeWindow: config.rateLimit.timeWindow,
    });
  }

  app.enableCors({
    origin: config.corsOrigin,
    methods: config.corsMethods,
    allowedHeaders: config.corsHeaders,
  });

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
    logger.log(`Started on port ${config.port}`);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

function intializeSwagger(app: NestFastifyApplication) {
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
