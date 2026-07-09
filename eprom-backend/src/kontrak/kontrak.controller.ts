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
import { CreateKontrakDto } from './dto/create-kontrak.dto';
import { UpdateKontrakDto } from './dto/update-kontrak.dto';
import { KontrakService } from './kontrak.service';

@Controller('kontrak')
export class KontrakController {
  constructor(private readonly service: KontrakService) {}

  @Post()
  create(@Body() dto: CreateKontrakDto) {
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
    @Body() dto: UpdateKontrakDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
