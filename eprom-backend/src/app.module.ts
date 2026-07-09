import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { VendorsModule } from './vendors/vendors.module';
import { ProjectsModule } from './projects/projects.module';
import { EvaluasiPenawaranModule } from './evaluasi-penawaran/evaluasi-penawaran.module';
import { KontrakModule } from './kontrak/kontrak.module';
import { TendersModule } from './tenders/tenders.module';

import { Role } from './roles/role.entity';
import { User } from './users/user.entity';
import { Vendor } from './vendors/vendor.entity';
import { Project } from './projects/project.entity';
import { EvaluasiPenawaran } from './evaluasi-penawaran/evaluasi-penawaran.entity';
import { Kontrak } from './kontrak/kontrak.entity';
import { Tender } from './tenders/tender.entity';
import { TenderVendor } from './tenders/tender-vendor.entity';
import { TenderDokumen } from './tenders/tender-dokumen.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [
          User,
          Role,
          Vendor,
          Project,
          EvaluasiPenawaran,
          Kontrak,
          Tender,
          TenderVendor,
          TenderDokumen,
        ],
        synchronize: true,
      }),
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    VendorsModule,
    ProjectsModule,
    EvaluasiPenawaranModule,
    KontrakModule,
    TendersModule,
  ],
})
export class AppModule {}
