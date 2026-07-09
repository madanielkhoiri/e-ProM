import { Role } from '../roles/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone_number!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  signature_image!: string;

  @Column({ nullable: true })
  two_factor_secret!: string;

  @Column({ default: false })
  is_two_factor_enabled!: boolean;

  @Column({ default: true })
  is_active!: boolean;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  role!: Role;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
