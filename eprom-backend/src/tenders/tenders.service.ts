import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Tender, StatusTender } from './tender.entity';
import { TenderVendor, StatusUndangan } from './tender-vendor.entity';
import { TenderDokumen, JenisDokumen } from './tender-dokumen.entity';
import { CreateTenderDto } from './dto/create-tender.dto';
import { BulkInviteDto } from './dto/bulk-invite.dto';
import { UploadDokumenDto } from './dto/upload-dokumen.dto';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Injectable()
export class TendersService {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,
    @InjectRepository(TenderVendor)
    private readonly tenderVendorRepository: Repository<TenderVendor>,
    @InjectRepository(TenderDokumen)
    private readonly tenderDokumenRepository: Repository<TenderDokumen>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(
    createTenderDto: CreateTenderDto,
    created_by: string,
  ): Promise<Tender> {
    // Check for duplicate nomor_wo
    const existingTender = await this.tenderRepository.findOne({
      where: { nomor_wo: createTenderDto.nomor_wo },
    });

    if (existingTender) {
      throw new ConflictException(`Tender dengan nomor WO '${createTenderDto.nomor_wo}' sudah terdaftar`);
    }

    const project = await this.projectRepository.findOne({
      where: { project_id: createTenderDto.project_id },
    });

    if (!project) {
      throw new NotFoundException(
        `Project with ID ${createTenderDto.project_id} not found`,
      );
    }

    const newTender = this.tenderRepository.create({
      ...createTenderDto,
      project,
      created_by,
      status_tender: StatusTender.DRAFT,
      is_deleted: false,
    });

    return this.tenderRepository.save(newTender);
  }

  async findAll(search?: string): Promise<Tender[]> {
    return this.tenderRepository.find({
      where: search ? [
        { is_deleted: false, nama_pekerjaan: Like(`%${search}%`) },
        { is_deleted: false, nomor_wo: Like(`%${search}%`) }
      ] : { is_deleted: false },
      relations: {
        project: true,
        tenderVendors: { vendor: true },
        dokumens: true,
      },
    });
  }

  async findByVendor(vendorId: number, search?: string): Promise<Tender[]> {
    return this.tenderRepository.find({
      where: search ? [
        { is_deleted: false, tenderVendors: { vendor: { vendor_id: vendorId } }, nama_pekerjaan: Like(`%${search}%`) },
        { is_deleted: false, tenderVendors: { vendor: { vendor_id: vendorId } }, nomor_wo: Like(`%${search}%`) }
      ] : {
        is_deleted: false,
        tenderVendors: {
          vendor: { vendor_id: vendorId }
        }
      },
      relations: {
        project: true,
        tenderVendors: { vendor: true },
        dokumens: true,
      },
    });
  }

  async findOne(id: number): Promise<Tender> {
    const tender = await this.tenderRepository.findOne({
      where: { tender_id: id, is_deleted: false },
      relations: {
        project: true,
        tenderVendors: { vendor: true },
        dokumens: true,
      },
    });
    if (!tender) {
      throw new NotFoundException(`Tender with ID ${id} not found`);
    }
    return tender;
  }

  async inviteVendor(
    tenderId: number,
    vendorId: number,
  ): Promise<TenderVendor> {
    const tender = await this.findOne(tenderId);

    const vendor = await this.vendorRepository.findOne({
      where: { vendor_id: vendorId },
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
    }

    const existingInvite = await this.tenderVendorRepository.findOne({
      where: {
        tender: { tender_id: tenderId },
        vendor: { vendor_id: vendorId },
      },
    });

    if (existingInvite) {
      return existingInvite; // Or throw ConflictException
    }

    const invite = this.tenderVendorRepository.create({
      tender_id: tenderId,
      vendor_id: vendorId,
      tender,
      vendor,
      status_undangan: StatusUndangan.DIUNDANG,
      tanggal_undang: new Date(),
    });

    const savedInvite = await this.tenderVendorRepository.save(invite);

    // Update status tender if draft
    if (tender.status_tender === StatusTender.DRAFT) {
      await this.tenderRepository.update(tenderId, { status_tender: StatusTender.DIUNDANG });
    }

    return savedInvite;
  }

  async bulkInvite(tenderId: number, dto: BulkInviteDto): Promise<TenderVendor[]> {
    console.log(`[DEBUG] Menerima request bulkInvite untuk tender_id: ${tenderId}`);
    console.log(`[DEBUG] Payload DTO vendor_ids:`, dto.vendor_ids);
    
    const tender = await this.findOne(tenderId);
    if (!tender) {
      console.log(`[DEBUG] Tender ${tenderId} tidak ditemukan!`);
    }
    
    // Check which vendors already invited
    const existingInvites = await this.tenderVendorRepository.find({
      where: { tender: { tender_id: tenderId } },
      relations: { vendor: true }
    });
    
    const existingVendorIds = existingInvites.map(inv => inv.vendor.vendor_id);
    console.log(`[DEBUG] Vendor yang sudah terundang:`, existingVendorIds);
    
    const vendorsToAdd = dto.vendor_ids.filter(id => !existingVendorIds.includes(id));
    const vendorsToRemove = existingInvites.filter(inv => !dto.vendor_ids.includes(inv.vendor.vendor_id));
    
    if (vendorsToRemove.length > 0) {
      console.log(`[DEBUG] Akan menghapus ${vendorsToRemove.length} vendor yang di-uncheck...`);
      await this.tenderVendorRepository.remove(vendorsToRemove);
    }
    
    const newInvites: TenderVendor[] = [];
    
    for (const vendorId of vendorsToAdd) {
      const vendor = await this.vendorRepository.findOne({ where: { vendor_id: vendorId } });
      if (!vendor) {
        console.log(`[DEBUG] Vendor ${vendorId} tidak ada di tabel t_vendor, di-skip!`);
        continue;
      }
      
      const invite = this.tenderVendorRepository.create({
        tender_id: tenderId,
        vendor_id: vendorId,
        tender,
        vendor,
        status_undangan: StatusUndangan.DIUNDANG,
        tanggal_undang: new Date(),
      });
      newInvites.push(invite);
    }
    
    if (newInvites.length > 0) {
      console.log(`[DEBUG] Akan menyimpan ${newInvites.length} vendor baru ke database...`);
      await this.tenderVendorRepository.save(newInvites);
      console.log(`[DEBUG] Berhasil save ke database!`);
    } else {
      console.log(`[DEBUG] Tidak ada vendor baru untuk diundang.`);
    }

    // Update status tender jika sebelumnya DRAFT dan sekarang ada vendor
    if (tender.status_tender === StatusTender.DRAFT && (existingInvites.length - vendorsToRemove.length + newInvites.length > 0)) {
      console.log(`[DEBUG] Update status tender menjadi DIUNDANG...`);
      await this.tenderRepository.update(tenderId, { status_tender: StatusTender.DIUNDANG });
    }
    
    return this.tenderVendorRepository.find({
      where: { tender: { tender_id: tenderId } },
      relations: { vendor: true }
    });
  }

  async uploadDokumens(
    tenderId: number,
    files: Express.Multer.File[],
    dto: UploadDokumenDto,
    uploaded_by: string
  ): Promise<TenderDokumen[]> {
    const tender = await this.findOne(tenderId);
    
    if (!files || files.length === 0) {
      throw new NotFoundException('Tidak ada file yang diunggah');
    }

    const savedDokumens: TenderDokumen[] = [];

    for (const file of files) {
      const dokumen = this.tenderDokumenRepository.create({
        tender,
        jenis_dokumen: dto.jenis_dokumen,
        nama_file: file.originalname,
        path_file: file.path,
        tipe_file: file.mimetype,
        ukuran_file: file.size,
        uploaded_by,
      });
      savedDokumens.push(dokumen);
    }

    return this.tenderDokumenRepository.save(savedDokumens);
  }

  async submitPenawaran(
    tenderId: number,
    vendorId: number,
    dto: import('./dto/submit-penawaran.dto').SubmitPenawaranDto,
    files: Express.Multer.File[],
  ): Promise<TenderVendor> {
    const tender = await this.findOne(tenderId);
    if (!tender) {
      throw new NotFoundException(`Tender with ID ${tenderId} not found`);
    }

    const tenderVendor = await this.tenderVendorRepository.findOne({
      where: {
        tender: { tender_id: tenderId },
        vendor: { vendor_id: vendorId },
      },
    });

    if (!tenderVendor) {
      throw new NotFoundException(
        `Undangan tender untuk vendor ${vendorId} tidak ditemukan`,
      );
    }

    // 1. Simpan Harga, Catatan & Update Status Undangan Vendor
    tenderVendor.harga_penawaran = dto.harga_penawaran;
    if (dto.catatan) {
      tenderVendor.catatan = dto.catatan;
    }
    tenderVendor.tanggal_submit_penawaran = new Date();
    tenderVendor.status_undangan = StatusUndangan.SUBMIT_PENAWARAN;
    await this.tenderVendorRepository.save(tenderVendor);

    // 2. Simpan Dokumen Penawaran
    if (files && files.length > 0) {
      const savedDokumens: TenderDokumen[] = [];
      for (const file of files) {
        const dokumen = this.tenderDokumenRepository.create({
          tender,
          tenderVendor,
          jenis_dokumen: JenisDokumen.DOKUMEN_PENAWARAN,
          nama_file: file.originalname,
          path_file: file.path,
          tipe_file: file.mimetype,
          ukuran_file: file.size,
          uploaded_by: dto.uploaded_by || `vendor-${vendorId}`,
        });
        savedDokumens.push(dokumen);
      }
      await this.tenderDokumenRepository.save(savedDokumens);
    }

    // 3. Update Status Tender Utama
    tender.status_tender = StatusTender.PENAWARAN_MASUK;
    await this.tenderRepository.save(tender);

    return tenderVendor;
  }

  async remove(id: number): Promise<void> {
    const tender = await this.findOne(id);
    tender.is_deleted = true;
    await this.tenderRepository.save(tender);
  }
}
