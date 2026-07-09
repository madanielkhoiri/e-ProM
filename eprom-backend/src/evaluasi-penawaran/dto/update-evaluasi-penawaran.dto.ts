import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluasiPenawaranDto } from './create-evaluasi-penawaran.dto';

export class UpdateEvaluasiPenawaranDto extends PartialType(CreateEvaluasiPenawaranDto) {}
