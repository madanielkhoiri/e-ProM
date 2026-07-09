import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto) {
    const existingVendor = await this.vendorRepository.findOne({
      where: { nomor_vendor: createVendorDto.nomor_vendor },
    });

    if (existingVendor) {
      throw new BadRequestException('Nomor vendor sudah digunakan');
    }

    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async findAll(search?: string) {
    if (search) {
      return this.vendorRepository.find({
        where: [
          { nomor_vendor: Like(`%${search}%`) },
          { nama_vendor: Like(`%${search}%`) },
          { email: Like(`%${search}%`) },
          { no_telepon: Like(`%${search}%`) },
        ],
        order: { created_at: 'DESC' },
      });
    }

    return this.vendorRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const vendor = await this.vendorRepository.findOne({
      where: { vendor_id: id },
    });

    if (!vendor) {
      throw new NotFoundException('Vendor tidak ditemukan');
    }

    return vendor;
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.findOne(id);

    Object.assign(vendor, updateVendorDto);

    return this.vendorRepository.save(vendor);
  }

  async remove(id: number) {
    const vendor = await this.findOne(id);

    await this.vendorRepository.remove(vendor);

    return {
      message: 'Vendor berhasil dihapus',
    };
  }
}
