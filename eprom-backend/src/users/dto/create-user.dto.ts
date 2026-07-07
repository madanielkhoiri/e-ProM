import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  username!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone_number?: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  role_name!: string;
}