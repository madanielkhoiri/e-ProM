import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTenderDto {
  @IsNotEmpty()
  @IsNumber()
  project_id: number;

  @IsNotEmpty()
  @IsString()
  nama_pekerjaan: string;

  @IsNotEmpty()
  @IsString()
  nomor_wo: string;

  @IsOptional()
  @IsNumber()
  estimasi_harga?: number;

  @IsOptional()
  @IsString()
  deskripsi_pekerjaan?: string;

  @IsOptional()
  tanggal_mulai_tender?: Date;

  @IsOptional()
  tanggal_batas_penawaran?: Date;
}
