import { Test, TestingModule } from '@nestjs/testing';
import { KontrakController } from './kontrak.controller';

describe('KontrakController', () => {
  let controller: KontrakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KontrakController],
    }).compile();

    controller = module.get<KontrakController>(KontrakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
