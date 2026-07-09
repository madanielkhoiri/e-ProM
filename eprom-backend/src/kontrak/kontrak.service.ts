import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateKontrakDto } from './dto/create-kontrak.dto';
import { UpdateKontrakDto } from './dto/update-kontrak.dto';
import { Kontrak, StatusKontrak } from './kontrak.entity';

@Injectable()
export class KontrakService {
  constructor(
    @InjectRepository(Kontrak)
    private readonly kontrakRepository: Repository<Kontrak>,
  ) {}

  async create(dto: CreateKontrakDto, file?: Express.Multer.File) {
    const existing = await this.kontrakRepository.findOne({
      where: { nomor_kontrak: dto.nomor_kontrak },
    });

    if (existing) {
      throw new BadRequestException('Nomor kontrak sudah digunakan');
    }

    const data = new Kontrak();

    data.tender_id = dto.tender_id ? Number(dto.tender_id) : null;
    data.vendor_id = dto.vendor_id ? Number(dto.vendor_id) : null;
    data.nomor_kontrak = dto.nomor_kontrak;
    data.nilai_kontrak = Number(dto.nilai_kontrak ?? 0);
    data.tanggal_kontrak = dto.tanggal_kontrak || null;
    data.tanggal_mulai = dto.tanggal_mulai || null;
    data.tanggal_selesai = dto.tanggal_selesai || null;
    data.status_kontrak = dto.status_kontrak ?? StatusKontrak.DRAFT;
    data.file_kontrak = file ? `uploads/kontrak/${file.filename}` : dto.file_kontrak ?? null;
    data.created_by = dto.created_by ?? null;

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

  async update(id: number, dto: UpdateKontrakDto, file?: Express.Multer.File) {
    const data = await this.findOne(id);

    if (dto.tender_id !== undefined) {
      data.tender_id = dto.tender_id ? Number(dto.tender_id) : null;
    }

    if (dto.vendor_id !== undefined) {
      data.vendor_id = dto.vendor_id ? Number(dto.vendor_id) : null;
    }

    if (dto.nomor_kontrak !== undefined) {
      data.nomor_kontrak = dto.nomor_kontrak;
    }

    if (dto.nilai_kontrak !== undefined) {
      data.nilai_kontrak = Number(dto.nilai_kontrak);
    }

    if (dto.tanggal_kontrak !== undefined) {
      data.tanggal_kontrak = dto.tanggal_kontrak || null;
    }

    if (dto.tanggal_mulai !== undefined) {
      data.tanggal_mulai = dto.tanggal_mulai || null;
    }

    if (dto.tanggal_selesai !== undefined) {
      data.tanggal_selesai = dto.tanggal_selesai || null;
    }

    if (dto.status_kontrak !== undefined) {
      data.status_kontrak = dto.status_kontrak;
    }

    if (file) {
      data.file_kontrak = `uploads/kontrak/${file.filename}`;
    }

    if (dto.created_by !== undefined) {
      data.created_by = dto.created_by || null;
    }

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
