import { Test, TestingModule } from "@nestjs/testing";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "../products/entities/Product.entity";
import { Repository } from "typeorm";

describe("Orders Controller", () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(ProductEntity),
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
