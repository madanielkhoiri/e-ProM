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

  @Column({ type: 'int', nullable: true })
  tender_id: number | null;

  @Column({ type: 'int', nullable: true })
  vendor_id: number | null;

  @Column({ type: 'varchar', unique: true })
  nomor_kontrak: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  nilai_kontrak: number;

  @Column({ type: 'date', nullable: true })
  tanggal_kontrak: string | null;

  @Column({ type: 'date', nullable: true })
  tanggal_mulai: string | null;

  @Column({ type: 'date', nullable: true })
  tanggal_selesai: string | null;

  @Column({
    type: 'enum',
    enum: StatusKontrak,
    default: StatusKontrak.DRAFT,
  })
  status_kontrak: StatusKontrak;

  @Column({ type: 'varchar', nullable: true })
  file_kontrak: string | null;

  @Column({ type: 'varchar', nullable: true })
  created_by: string | null;

  @CreateDateColumn()
  created_at: Date;
}
