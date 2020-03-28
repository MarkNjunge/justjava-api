import { Test, TestingModule } from "@nestjs/testing";
import { MpesaService } from "./mpesa.service";
import { PaymentEntity } from "../entities/Payment.entity";
import { OrderEntity } from "../../shared/orders/entities/Order.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RedisService } from "../../shared/redis/redis.service";
import { NotificationsService } from "../../notifications/notifications.service";
import { UserEntity } from "../../shared/users/entities/User.entity";

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
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
        {
          provide: NotificationsService,
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
