import { Test, TestingModule } from "@nestjs/testing";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "../shared/products/entities/Product.entity";
import { Repository } from "typeorm";
import { OrderEntity } from "./entities/Order.entity";
import { UserEntity } from "../users/entities/User.entity";
import { RedisService } from "../redis/redis.service";

describe("Orders Controller", () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
        {
          provide: getRepositoryToken(ProductEntity),
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
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
