import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluasiPenawaranController } from './evaluasi-penawaran.controller';
import { EvaluasiPenawaran } from './evaluasi-penawaran.entity';
import { EvaluasiPenawaranService } from './evaluasi-penawaran.service';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluasiPenawaran])],
  controllers: [EvaluasiPenawaranController],
  providers: [EvaluasiPenawaranService],
  exports: [EvaluasiPenawaranService],
})
export class EvaluasiPenawaranModule {}
