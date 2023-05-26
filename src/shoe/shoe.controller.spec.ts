import { Test, TestingModule } from '@nestjs/testing';
import { ShoeController } from './shoe.controller';

describe('ShoeController', () => {
  let controller: ShoeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoeController],
    }).compile();

    controller = module.get<ShoeController>(ShoeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
