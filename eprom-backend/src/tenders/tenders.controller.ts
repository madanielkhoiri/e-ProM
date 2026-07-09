import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { TendersService } from './tenders.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { BulkInviteDto } from './dto/bulk-invite.dto';
import { UploadDokumenDto } from './dto/upload-dokumen.dto';
import { diskStorage } from 'multer';

@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Post()
  create(@Body() createTenderDto: CreateTenderDto) {
    return this.tendersService.create(createTenderDto, 'system'); // default created_by
  }

  @Post(':id/invites')
  bulkInvite(@Param('id') id: string, @Body() bulkInviteDto: BulkInviteDto) {
    return this.tendersService.bulkInvite(+id, bulkInviteDto);
  }

  @Post(':id/documents')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/tenders',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
  )
  uploadDocuments(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadDokumenDto: UploadDokumenDto,
  ) {
    return this.tendersService.uploadDokumens(+id, files, uploadDokumenDto, 'system');
  }

  @Get()
  findAll() {
    return this.tendersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tendersService.findOne(+id);
  }

  @Post(':id/invite/:vendorId')
  inviteVendor(@Param('id') id: string, @Param('vendorId') vendorId: string) {
    return this.tendersService.inviteVendor(+id, +vendorId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tendersService.remove(+id);
  }
}
