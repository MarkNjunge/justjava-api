import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { RedisService } from "../redis/redis.service";
import { UserEntity } from "../users/entities/User.entity";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { EmailService } from "../email/email.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: RedisService,
          useClass: jest.fn(),
        },
        {
          provide: EmailService,
          useClass: jest.fn(),
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
