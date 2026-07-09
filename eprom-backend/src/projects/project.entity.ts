import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Tender } from '../tenders/tender.entity';

export enum ProjectStatus {
  AKTIF = 'aktif',
  SELESAI = 'selesai',
  BATAL = 'batal',
}

@Entity('m_project')
export class Project {
  @PrimaryGeneratedColumn()
  project_id: number;

  @Column()
  nama_project: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;

  @Column({ nullable: true })
  pic: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.AKTIF,
  })
  status: ProjectStatus;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Tender, (tender) => tender.project)
  tenders: Tender[];
}
