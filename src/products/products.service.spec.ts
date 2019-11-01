import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/Product.entity";
import { Repository } from "typeorm";

describe("ProductsService", () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(ProductEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
