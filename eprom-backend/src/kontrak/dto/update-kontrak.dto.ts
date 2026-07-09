import { PartialType } from '@nestjs/mapped-types';
import { CreateKontrakDto } from './create-kontrak.dto';

export class UpdateKontrakDto extends PartialType(CreateKontrakDto) {}
