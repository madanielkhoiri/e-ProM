import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  EnableTwoFactorDto,
  GenerateTwoFactorDto,
  VerifyTwoFactorLoginDto,
} from './dto/two-factor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('2fa/generate')
  generateTwoFactor(@Body() dto: GenerateTwoFactorDto) {
    return this.authService.generateTwoFactorQrCode(dto.temporaryToken);
  }

  @Post('2fa/enable')
  enableTwoFactor(@Body() dto: EnableTwoFactorDto) {
    return this.authService.enableTwoFactor(dto.temporaryToken, dto.code);
  }

  @Post('2fa/verify-login')
  verifyTwoFactorLogin(@Body() dto: VerifyTwoFactorLoginDto) {
    return this.authService.verifyTwoFactorLogin(dto.temporaryToken, dto.code);
  }

  @Get('me')
  async me(@Headers('authorization') authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Authorization header tidak ditemukan');
    }

    const token = authorization.replace('Bearer ', '');
    const payload = await this.authService.verifyAccessToken(token);

    return this.authService.me(payload.sub);
  }
}