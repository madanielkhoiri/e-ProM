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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateKontrakDto } from './dto/create-kontrak.dto';
import { UpdateKontrakDto } from './dto/update-kontrak.dto';
import { KontrakService } from './kontrak.service';

const kontrakUploadStorage = diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = './uploads/kontrak';

    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true });
    }

    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(
      file.originalname,
    )}`;

    callback(null, uniqueName);
  },
});

@Controller('kontrak')
export class KontrakController {
  constructor(private readonly service: KontrakService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file_kontrak', {
      storage: kontrakUploadStorage,
    }),
  )
  create(
    @Body() dto: CreateKontrakDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
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
  @UseInterceptors(
    FileInterceptor('file_kontrak', {
      storage: kontrakUploadStorage,
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKontrakDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.update(id, dto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
