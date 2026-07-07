import { IsNotEmpty } from 'class-validator';

export class GenerateTwoFactorDto {
  @IsNotEmpty()
  temporaryToken!: string;
}

export class EnableTwoFactorDto {
  @IsNotEmpty()
  temporaryToken!: string;

  @IsNotEmpty()
  code!: string;
}

export class VerifyTwoFactorLoginDto {
  @IsNotEmpty()
  temporaryToken!: string;

  @IsNotEmpty()
  code!: string;
}