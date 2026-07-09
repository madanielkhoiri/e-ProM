import { IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class BulkInviteDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  vendor_ids!: number[];
}
