import { Test, TestingModule } from "@nestjs/testing";
import { OrdersService } from "./orders.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "../products/entities/Product.entity";
import { Repository } from "typeorm";

describe("OrdersService", () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
