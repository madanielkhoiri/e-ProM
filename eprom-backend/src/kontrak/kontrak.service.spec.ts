import { Test, TestingModule } from '@nestjs/testing';
import { KontrakService } from './kontrak.service';

describe('KontrakService', () => {
  let service: KontrakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KontrakService],
    }).compile();

    service = module.get<KontrakService>(KontrakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
