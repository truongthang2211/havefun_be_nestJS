import { Test, TestingModule } from '@nestjs/testing';
import { HotelusersService } from './hotelusers.service';

describe('HotelusersService', () => {
  let service: HotelusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HotelusersService],
    }).compile();

    service = module.get<HotelusersService>(HotelusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
