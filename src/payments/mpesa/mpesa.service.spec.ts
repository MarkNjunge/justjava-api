import { Test, TestingModule } from "@nestjs/testing";
import { MpesaService } from "./mpesa.service";
import { PaymentEntity } from "../entities/Payment.entity";
import { OrderEntity } from "../../orders/entities/Order.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RedisService } from "../../redis/redis.service";

describe("MpesaService", () => {
  let service: MpesaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MpesaService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderEntity),
          useClass: Repository,
        },
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<MpesaService>(MpesaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
