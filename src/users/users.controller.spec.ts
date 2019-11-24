import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { RedisService } from "../redis/redis.service";
import { UsersService } from "./users.service";

describe("Users Controller", () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
        {
          provide: UsersService,
          useClass: jest.fn(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
