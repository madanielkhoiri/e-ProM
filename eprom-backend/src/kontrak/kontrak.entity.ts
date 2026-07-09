import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusKontrak {
  DRAFT = 'draft',
  AKTIF = 'aktif',
  SELESAI = 'selesai',
  TERMINASI = 'terminasi',
}

@Entity('t_kontrak')
export class Kontrak {
  @PrimaryGeneratedColumn()
  kontrak_id: number;

  @Column({ nullable: true })
  tender_id: number;

  @Column({ nullable: true })
  vendor_id: number;

  @Column({ unique: true })
  nomor_kontrak: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  nilai_kontrak: number;

  @Column({ type: 'date', nullable: true })
  tanggal_kontrak: string;

  @Column({ type: 'date', nullable: true })
  tanggal_mulai: string;

  @Column({ type: 'date', nullable: true })
  tanggal_selesai: string;

  @Column({
    type: 'enum',
    enum: StatusKontrak,
    default: StatusKontrak.DRAFT,
  })
  status_kontrak: StatusKontrak;

  @Column({ nullable: true })
  file_kontrak: string;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;
}
