import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KontrakController } from './kontrak.controller';
import { Kontrak } from './kontrak.entity';
import { KontrakService } from './kontrak.service';

@Module({
  imports: [TypeOrmModule.forFeature([Kontrak])],
  controllers: [KontrakController],
  providers: [KontrakService],
  exports: [KontrakService],
})
export class KontrakModule {}
