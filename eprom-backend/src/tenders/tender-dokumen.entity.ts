import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { TenderVendor } from './tender-vendor.entity';

export enum JenisDokumen {
  DOKUMEN_PEKERJAAN = 'dokumen_pekerjaan',
  DOKUMEN_PENAWARAN = 'dokumen_penawaran',
  DOKUMEN_EVALUASI = 'dokumen_evaluasi',
  DOKUMEN_KONTRAK = 'dokumen_kontrak',
}

@Entity('t_tender_dokumen')
export class TenderDokumen {
  @PrimaryGeneratedColumn()
  dokumen_id: number;

  @Column({
    type: 'enum',
    enum: JenisDokumen,
  })
  jenis_dokumen: JenisDokumen;

  @Column()
  nama_file: string;

  @Column()
  path_file: string;

  @Column({ nullable: true })
  tipe_file: string;

  @Column({ type: 'int', nullable: true })
  ukuran_file: number;

  @Column({ nullable: true })
  uploaded_by: string;

  @CreateDateColumn()
  uploaded_at: Date;

  // Relations
  @ManyToOne(() => Tender, (tender) => tender.dokumens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @ManyToOne(() => TenderVendor, (tenderVendor) => tenderVendor.dokumens, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tender_vendor_id' })
  tenderVendor: TenderVendor;
}
