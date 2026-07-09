import { IsEnum, IsNotEmpty } from 'class-validator';
import { JenisDokumen } from '../tender-dokumen.entity';

export class UploadDokumenDto {
  @IsNotEmpty()
  @IsEnum(JenisDokumen)
  jenis_dokumen!: JenisDokumen;
}
