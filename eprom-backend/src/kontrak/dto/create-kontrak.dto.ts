import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusKontrak } from '../kontrak.entity';

export class CreateKontrakDto {
  @IsNumber()
  @IsOptional()
  tender_id?: number;

  @IsNumber()
  @IsOptional()
  vendor_id?: number;

  @IsString()
  @IsNotEmpty()
  nomor_kontrak: string;

  @IsNumber()
  @IsOptional()
  nilai_kontrak?: number;

  @IsDateString()
  @IsOptional()
  tanggal_kontrak?: string;

  @IsDateString()
  @IsOptional()
  tanggal_mulai?: string;

  @IsDateString()
  @IsOptional()
  tanggal_selesai?: string;

  @IsEnum(StatusKontrak)
  @IsOptional()
  status_kontrak?: StatusKontrak;

  @IsString()
  @IsOptional()
  file_kontrak?: string;

  @IsString()
  @IsOptional()
  created_by?: string;
}
