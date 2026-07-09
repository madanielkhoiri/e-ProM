import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { authenticator } from '@otplib/preset-default';
import * as QRCode from 'qrcode';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );

    if (!user) {
      throw new UnauthorizedException('Username/email atau password salah');
    }

    if (user.is_active === false) {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Username/email atau password salah');
    }

    const accessToken = await this.createAccessToken(user.id);

    return {
      message: 'Login berhasil',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role?.name,
      },
    };
  }

  async generateTwoFactorQrCode(temporaryToken: string) {
    const payload = await this.verifyTemporaryToken(temporaryToken);
    const user = await this.usersService.findById(payload.sub);

    let secret = user.two_factor_secret;

    if (!secret) {
      secret = authenticator.generateSecret();
      await this.usersService.updateTwoFactorSecret(user.id, secret);
    }

    const appName =
      this.configService.get<string>('TWO_FACTOR_APP_NAME') || 'E-ProM';

    const otpauthUrl = authenticator.keyuri(user.username, appName, secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    return {
      message:
        'Scan QR Code menggunakan Google Authenticator atau Microsoft Authenticator',
      qrCodeDataUrl,
      manualKey: secret,
    };
  }

  async enableTwoFactor(temporaryToken: string, code: string) {
    const payload = await this.verifyTemporaryToken(temporaryToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user.two_factor_secret) {
      throw new BadRequestException('Secret 2FA belum dibuat');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Kode Authenticator salah');
    }

    const updatedUser = await this.usersService.enableTwoFactor(user.id);
    const accessToken = await this.createAccessToken(updatedUser.id);

    return {
      message: 'Authenticator berhasil diaktifkan. Login berhasil.',
      accessToken,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role?.name,
      },
    };
  }

  async verifyTwoFactorLogin(temporaryToken: string, code: string) {
    const payload = await this.verifyTemporaryToken(temporaryToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user.is_two_factor_enabled || !user.two_factor_secret) {
      throw new BadRequestException('2FA belum aktif untuk user ini');
    }

    const isValid = authenticator.verify({
      token: code,
      secret: user.two_factor_secret,
    });

    if (!isValid) {
      throw new UnauthorizedException('Kode Authenticator salah');
    }

    const accessToken = await this.createAccessToken(user.id);

    return {
      message: 'Login berhasil',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role?.name,
      },
    };
  }

  async me(userId: number) {
    const user = await this.usersService.findById(userId);

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role?.name,
      is_two_factor_enabled: user.is_two_factor_enabled,
    };
  }

  async verifyAccessToken(token: string) {
    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') || 'eprom_secret_key';

      return await this.jwtService.verifyAsync(token, {
        secret,
      });
    } catch {
      throw new UnauthorizedException('Token tidak valid');
    }
  }

  private async createTemporaryToken(userId: number) {
    const secret =
      this.configService.get<string>('TEMP_JWT_SECRET') ||
      'eprom_temp_secret_key';

    const expiresIn =
      this.configService.get<string>('TEMP_JWT_EXPIRES_IN') || '10m';

    return this.jwtService.signAsync(
      {
        sub: userId,
        type: 'TEMP_2FA',
      },
      {
        secret,
        expiresIn,
      } as any,
    );
  }

  private async verifyTemporaryToken(token: string) {
    try {
      const secret =
        this.configService.get<string>('TEMP_JWT_SECRET') ||
        'eprom_temp_secret_key';

      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });

      if (payload.type !== 'TEMP_2FA') {
        throw new UnauthorizedException('Temporary token tidak valid');
      }

      return payload;
    } catch {
      throw new UnauthorizedException(
        'Temporary token tidak valid atau expired',
      );
    }
  }

  private async createAccessToken(userId: number) {
    const secret =
      this.configService.get<string>('JWT_SECRET') || 'eprom_secret_key';

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1d';

    return this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret,
        expiresIn,
      } as any,
    );
  }
}
