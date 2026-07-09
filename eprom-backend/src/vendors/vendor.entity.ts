import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TenderVendor } from '../tenders/tender-vendor.entity';

@Entity('m_vendor')
export class Vendor {
  @PrimaryGeneratedColumn()
  vendor_id: number;

  @Column({ unique: true })
  nomor_vendor: string;

  @Column()
  nama_vendor: string;

  @Column({ type: 'text', nullable: true })
  alamat: string;

  @Column({ nullable: true })
  no_telepon: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  status_aktif: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => TenderVendor, (tv) => tv.vendor)
  tenderVendors: TenderVendor[];
}
