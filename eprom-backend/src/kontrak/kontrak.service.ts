import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKontrakDto } from './dto/create-kontrak.dto';
import { UpdateKontrakDto } from './dto/update-kontrak.dto';
import { Kontrak } from './kontrak.entity';

@Injectable()
export class KontrakService {
  constructor(
    @InjectRepository(Kontrak)
    private readonly kontrakRepository: Repository<Kontrak>,
  ) {}

  async create(dto: CreateKontrakDto) {
    const existing = await this.kontrakRepository.findOne({
      where: { nomor_kontrak: dto.nomor_kontrak },
    });

    if (existing) {
      throw new BadRequestException('Nomor kontrak sudah digunakan');
    }

    const data = this.kontrakRepository.create(dto);
    return this.kontrakRepository.save(data);
  }

  async findAll(search?: string) {
    if (search) {
      return this.kontrakRepository.find({
        where: [
          { nomor_kontrak: Like(`%${search}%`) },
          { status_kontrak: Like(`%${search}%`) as any },
          { file_kontrak: Like(`%${search}%`) },
          { created_by: Like(`%${search}%`) },
        ],
        order: { created_at: 'DESC' },
      });
    }

    return this.kontrakRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const data = await this.kontrakRepository.findOne({
      where: { kontrak_id: id },
    });

    if (!data) {
      throw new NotFoundException('Kontrak tidak ditemukan');
    }

    return data;
  }

  async update(id: number, dto: UpdateKontrakDto) {
    const data = await this.findOne(id);

    Object.assign(data, dto);

    return this.kontrakRepository.save(data);
  }

  async remove(id: number) {
    const data = await this.findOne(id);

    await this.kontrakRepository.remove(data);

    return {
      message: 'Kontrak berhasil dihapus',
    };
  }
}
