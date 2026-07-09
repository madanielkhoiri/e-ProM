import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  nomor_vendor: string;

  @IsString()
  @IsNotEmpty()
  nama_vendor: string;

  @IsString()
  @IsOptional()
  alamat?: string;

  @IsString()
  @IsOptional()
  no_telepon?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  status_aktif?: boolean;
}
