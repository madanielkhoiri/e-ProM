import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateEvaluasiPenawaranDto } from './dto/create-evaluasi-penawaran.dto';
import { UpdateEvaluasiPenawaranDto } from './dto/update-evaluasi-penawaran.dto';
import { EvaluasiPenawaran } from './evaluasi-penawaran.entity';

@Injectable()
export class EvaluasiPenawaranService {
  constructor(
    @InjectRepository(EvaluasiPenawaran)
    private readonly evaluasiRepository: Repository<EvaluasiPenawaran>,
  ) {}

  async create(dto: CreateEvaluasiPenawaranDto) {
    const total_nilai =
      dto.total_nilai ?? Number(dto.nilai_teknis ?? 0) + Number(dto.nilai_harga ?? 0);

    const data = this.evaluasiRepository.create({
      ...dto,
      total_nilai,
    });

    return this.evaluasiRepository.save(data);
  }

  async findAll(search?: string) {
    if (search) {
      return this.evaluasiRepository.find({
        where: [
          { nama_project: Like(`%${search}%`) },
          { nama_vendor: Like(`%${search}%`) },
          { status_evaluasi: Like(`%${search}%`) as any },
          { created_by: Like(`%${search}%`) },
        ],
        order: { created_at: 'DESC' },
      });
    }

    return this.evaluasiRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const data = await this.evaluasiRepository.findOne({
      where: { evaluasi_id: id },
    });

    if (!data) {
      throw new NotFoundException('Evaluasi penawaran tidak ditemukan');
    }

    return data;
  }

  async update(id: number, dto: UpdateEvaluasiPenawaranDto) {
    const data = await this.findOne(id);

    Object.assign(data, dto);

    if (dto.nilai_teknis !== undefined || dto.nilai_harga !== undefined) {
      data.total_nilai = Number(data.nilai_teknis ?? 0) + Number(data.nilai_harga ?? 0);
    }

    return this.evaluasiRepository.save(data);
  }

  async remove(id: number) {
    const data = await this.findOne(id);
    await this.evaluasiRepository.remove(data);

    return {
      message: 'Evaluasi penawaran berhasil dihapus',
    };
  }
}
