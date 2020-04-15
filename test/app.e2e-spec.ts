import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { INestApplication, HttpServer } from "@nestjs/common";
import { AppService } from "../src/app/app.service";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { initializeWinston } from "../src/common/logging/CustomLogger";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  const appService = {
    getHello: () => "justjava",
  };
  let server: HttpServer;

  beforeAll(() => {
    // Prevents Winston error 'Attempt to write logs with no transports'
    initializeWinston();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();

    // Wait for fastify
    await app.getHttpAdapter().getInstance().ready();

    server = app.getHttpServer();
  });

  it("GET /", () => {
    return request(server).get("/").expect(200).expect(appService.getHello());
  });

  afterAll(async () => {
    await app.close();
  });
});
