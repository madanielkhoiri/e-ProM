import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { StatusEvaluasiPenawaran } from '../evaluasi-penawaran.entity';

export class CreateEvaluasiPenawaranDto {
  @IsNumber()
  @IsOptional()
  project_id?: number;

  @IsNumber()
  @IsOptional()
  vendor_id?: number;

  @IsString()
  @IsOptional()
  nama_project?: string;

  @IsString()
  @IsOptional()
  nama_vendor?: string;

  @IsNumber()
  @IsOptional()
  harga_penawaran?: number;

  @IsNumber()
  @IsOptional()
  nilai_teknis?: number;

  @IsNumber()
  @IsOptional()
  nilai_harga?: number;

  @IsNumber()
  @IsOptional()
  total_nilai?: number;

  @IsEnum(StatusEvaluasiPenawaran)
  @IsOptional()
  status_evaluasi?: StatusEvaluasiPenawaran;

  @IsString()
  @IsOptional()
  catatan?: string;

  @IsString()
  @IsOptional()
  created_by?: string;
}
