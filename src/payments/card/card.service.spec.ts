import { Test, TestingModule } from "@nestjs/testing";
import { CardService } from "./card.service";
import { OrderEntity } from "../../orders/entities/Order.entity";
import { UserEntity } from "../../users/entities/User.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PaymentEntity } from "../entities/Payment.entity";
import { Repository } from "typeorm";
import { RavepayService } from "../../ravepay/ravepay.service";
import { NotificationsService } from "../../notifications/notifications.service";

describe("CardService", () => {
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
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
          provide: RavepayService,
          useClass: jest.fn(),
        },
        {
          provide: NotificationsService,
          useClass: jest.fn(),
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
