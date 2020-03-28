import { NestFactory } from "@nestjs/core";
import { CustomLogger, initializeWinston } from "./common/CustomLogger";
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

  if (config.rateLimit.enabled === true) {
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
  app.useGlobalPipes(new ValidationPipe());

  const redis = await app.get<RedisService>(RedisService);
  redis.connect();

  const notifications = await app.get<NotificationsService>(
    NotificationsService,
  );
  await notifications.connect();

  await app.listen(config.port, "0.0.0.0").then(() => {
    logger.log(`Started on port ${config.port}`);
  });
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
