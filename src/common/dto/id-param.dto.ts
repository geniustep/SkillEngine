import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ description: 'معرف العنصر (UUID)', format: 'uuid' })
  @IsUUID('4', { message: 'المعرف يجب أن يكون UUID صالح' })
  id: string;
}

