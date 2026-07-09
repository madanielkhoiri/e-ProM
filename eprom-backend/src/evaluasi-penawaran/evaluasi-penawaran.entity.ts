import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum StatusEvaluasiPenawaran {
  LULUS = 'lulus',
  TIDAK_LULUS = 'tidak_lulus',
  NEGOSIASI = 'negosiasi',
}

@Entity('evaluasi_penawaran')
export class EvaluasiPenawaran {
  @PrimaryGeneratedColumn()
  evaluasi_id: number;

  @Column({ nullable: true })
  project_id: number;

  @Column({ nullable: true })
  vendor_id: number;

  @Column({ nullable: true })
  nama_project: string;

  @Column({ nullable: true })
  nama_vendor: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  harga_penawaran: number;

  @Column({ type: 'int', default: 0 })
  nilai_teknis: number;

  @Column({ type: 'int', default: 0 })
  nilai_harga: number;

  @Column({ type: 'int', default: 0 })
  total_nilai: number;

  @Column({
    type: 'enum',
    enum: StatusEvaluasiPenawaran,
    default: StatusEvaluasiPenawaran.NEGOSIASI,
  })
  status_evaluasi: StatusEvaluasiPenawaran;

  @Column({ type: 'text', nullable: true })
  catatan: string;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
