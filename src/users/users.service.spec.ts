import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { AddressEntity } from "./entities/Address.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserEntity } from "./entities/User.entity";
import { Repository } from "typeorm";
import { RedisService } from "../redis/redis.service";

describe("UsersService", () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
