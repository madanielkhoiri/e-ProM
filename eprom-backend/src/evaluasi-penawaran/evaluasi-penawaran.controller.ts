import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEvaluasiPenawaranDto } from './dto/create-evaluasi-penawaran.dto';
import { UpdateEvaluasiPenawaranDto } from './dto/update-evaluasi-penawaran.dto';
import { EvaluasiPenawaranService } from './evaluasi-penawaran.service';

@Controller('evaluasi-penawaran')
export class EvaluasiPenawaranController {
  constructor(private readonly service: EvaluasiPenawaranService) {}

  @Post()
  create(@Body() dto: CreateEvaluasiPenawaranDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvaluasiPenawaranDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
