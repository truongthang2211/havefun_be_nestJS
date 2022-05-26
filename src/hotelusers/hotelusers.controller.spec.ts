import { Test, TestingModule } from '@nestjs/testing';
import { HotelusersController } from './hotelusers.controller';

describe('HotelusersController', () => {
  let controller: HotelusersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HotelusersController],
    }).compile();

    controller = module.get<HotelusersController>(HotelusersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
