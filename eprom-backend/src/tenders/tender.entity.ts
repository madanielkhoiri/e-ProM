import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '../projects/project.entity';
import type { TenderVendor } from './tender-vendor.entity';
import type { TenderDokumen } from './tender-dokumen.entity';

export enum StatusTender {
  DRAFT = 'draft',
  DIUNDANG = 'diundang',
  PENAWARAN_MASUK = 'penawaran_masuk',
  EVALUASI = 'evaluasi',
  KONTRAK = 'kontrak',
  SELESAI = 'selesai',
  BATAL = 'batal',
}

@Entity('t_tender')
export class Tender {
  @PrimaryGeneratedColumn()
  tender_id: number;

  @Column()
  nama_pekerjaan: string;

  @Column({ unique: true })
  nomor_wo: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimasi_harga: number;

  @Column({ type: 'text', nullable: true })
  deskripsi_pekerjaan: string;

  @Column({ type: 'date', nullable: true })
  tanggal_mulai_tender: Date;

  @Column({ type: 'date', nullable: true })
  tanggal_batas_penawaran: Date;

  @Column({
    type: 'enum',
    enum: StatusTender,
    default: StatusTender.DRAFT,
  })
  status_tender: StatusTender;

  @Column({ default: false })
  is_deleted: boolean;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @ManyToOne(() => Project, (project) => project.tenders, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @OneToMany('TenderVendor', (tenderVendor: TenderVendor) => tenderVendor.tender)
  tenderVendors: TenderVendor[];

  @OneToMany('TenderDokumen', (dokumen: TenderDokumen) => dokumen.tender)
  dokumens: TenderDokumen[];
}
