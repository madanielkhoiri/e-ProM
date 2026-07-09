import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitPenawaranDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  harga_penawaran: number;

  @IsOptional()
  @IsString()
  uploaded_by?: string;

  @IsOptional()
  @IsString()
  catatan?: string;
}
