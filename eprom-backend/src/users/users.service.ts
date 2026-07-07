import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { authenticator } from '@otplib/preset-default';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email || '' },
      ],
    });

    if (existingUser) {
      throw new BadRequestException('Username atau email sudah digunakan');
    }

    let role = await this.roleRepository.findOne({
      where: { name: createUserDto.role_name },
    });

    if (!role) {
      role = this.roleRepository.create({
        name: createUserDto.role_name,
      });

      await this.roleRepository.save(role);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    /**
     * Manual key Authenticator dibuat langsung saat akun dibuat.
     * Manual key ini hanya ditampilkan di response create user.
     */
    const twoFactorSecret = authenticator.generateSecret();

    const user = this.userRepository.create({
      name: createUserDto.name,
      username: createUserDto.username,
      email: createUserDto.email,
      phone_number: createUserDto.phone_number,
      password: hashedPassword,
      role,
      two_factor_secret: twoFactorSecret,
      is_two_factor_enabled: true,
      is_active: true,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      message:
        'User berhasil dibuat. Simpan manualKey dan berikan kepada user untuk dimasukkan ke aplikasi Authenticator.',
      user: {
        id: savedUser.id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        phone_number: savedUser.phone_number,
        role: savedUser.role.name,
        is_two_factor_enabled: savedUser.is_two_factor_enabled,
      },
      authenticator: {
        accountName: `E-ProM ${savedUser.username}`,
        manualKey: twoFactorSecret,
        instruction:
          'Buka Google/Microsoft Authenticator → Tambahkan akun → Masukkan kunci setup → isi manualKey ini → pilih berbasis waktu.',
      },
    };
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    return this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    return user;
  }

  async resetTwoFactor(userId: number) {
    const user = await this.findById(userId);

    const newSecret = authenticator.generateSecret();

    await this.userRepository.update(user.id, {
      two_factor_secret: newSecret,
      is_two_factor_enabled: true,
    });

    const updatedUser = await this.findById(user.id);

    return {
      message:
        '2FA berhasil di-reset. Berikan manualKey baru ini kepada user.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        role: updatedUser.role?.name,
      },
      authenticator: {
        accountName: `E-ProM ${updatedUser.username}`,
        manualKey: newSecret,
        instruction:
          'Masukkan manualKey baru ini ke aplikasi Authenticator user.',
      },
    };
  }

  async updateTwoFactorSecret(userId: number, secret: string) {
    await this.userRepository.update(userId, {
      two_factor_secret: secret,
    });

    return this.findById(userId);
  }

  async enableTwoFactor(userId: number) {
    await this.userRepository.update(userId, {
      is_two_factor_enabled: true,
    });

    return this.findById(userId);
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role?.name,
      is_active: user.is_active,
      is_two_factor_enabled: user.is_two_factor_enabled,
    }));
  }
}