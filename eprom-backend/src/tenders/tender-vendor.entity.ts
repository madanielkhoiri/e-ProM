import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { Vendor } from '../vendors/vendor.entity';
import { TenderDokumen } from './tender-dokumen.entity';

export enum StatusUndangan {
  DIUNDANG = 'diundang',
  DILIHAT = 'dilihat',
  SUBMIT_PENAWARAN = 'submit_penawaran',
  MENOLAK = 'menolak',
  EXPIRED = 'expired',
}

@Entity('t_tender_vendor')
export class TenderVendor {
  @PrimaryGeneratedColumn()
  tender_vendor_id: number;

  @Column({ nullable: true })
  tender_id: number;

  @Column({ nullable: true })
  vendor_id: number;

  @Column({
    type: 'enum',
    enum: StatusUndangan,
    default: StatusUndangan.DIUNDANG,
  })
  status_undangan: StatusUndangan;

  @Column({ type: 'datetime', nullable: true })
  tanggal_undang: Date;

  @Column({ type: 'datetime', nullable: true })
  tanggal_submit_penawaran: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  harga_penawaran: number;

  @Column({ type: 'text', nullable: true })
  catatan: string;

  // Relations
  @ManyToOne(() => Tender, (tender) => tender.tenderVendors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tender_id' })
  tender: Tender;

  @ManyToOne(() => Vendor, (vendor) => vendor.tenderVendors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @OneToMany(() => TenderDokumen, (dokumen) => dokumen.tenderVendor)
  dokumens: TenderDokumen[];
}
