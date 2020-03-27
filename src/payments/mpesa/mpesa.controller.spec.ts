import { Test, TestingModule } from "@nestjs/testing";
import { MpesaController } from "./mpesa.controller";
import { MpesaService } from "./mpesa.service";
import { RedisService } from "../../shared/redis/redis.service";

describe("Mpesa Controller", () => {
  let controller: MpesaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MpesaController],
      providers: [
        {
          provide: MpesaService,
          useClass: jest.fn(),
        },
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<MpesaController>(MpesaController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
