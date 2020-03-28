import { Test, TestingModule } from '@nestjs/testing';
import { RavepayService } from './ravepay.service';

describe('RavepayService', () => {
  let service: RavepayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RavepayService],
    }).compile();

    service = module.get<RavepayService>(RavepayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
