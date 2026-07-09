import { Test, TestingModule } from '@nestjs/testing';
import { EvaluasiPenawaranService } from './evaluasi-penawaran.service';

describe('EvaluasiPenawaranService', () => {
  let service: EvaluasiPenawaranService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvaluasiPenawaranService],
    }).compile();

    service = module.get<EvaluasiPenawaranService>(EvaluasiPenawaranService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
