import { Test, TestingModule } from '@nestjs/testing';
import { EvaluasiPenawaranController } from './evaluasi-penawaran.controller';

describe('EvaluasiPenawaranController', () => {
  let controller: EvaluasiPenawaranController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluasiPenawaranController],
    }).compile();

    controller = module.get<EvaluasiPenawaranController>(EvaluasiPenawaranController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
