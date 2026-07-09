import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TendersService } from './tenders.service';
import { TendersController } from './tenders.controller';
import { Tender } from './tender.entity';
import { TenderVendor } from './tender-vendor.entity';
import { TenderDokumen } from './tender-dokumen.entity';
import { Project } from '../projects/project.entity';
import { Vendor } from '../vendors/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      TenderVendor,
      TenderDokumen,
      Project,
      Vendor,
    ]),
  ],
  controllers: [TendersController],
  providers: [TendersService],
  exports: [TendersService],
})
export class TendersModule {}
