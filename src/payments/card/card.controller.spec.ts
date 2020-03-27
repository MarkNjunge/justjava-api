import { Test, TestingModule } from "@nestjs/testing";
import { CardController } from "./card.controller";
import { CardService } from "./card.service";
import { RedisService } from "../../shared/redis/redis.service";

describe("Card Controller", () => {
  let controller: CardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useClass: jest.fn(),
        },
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
