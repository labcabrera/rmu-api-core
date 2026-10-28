import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { KeyValue } from '../../../domain/entities/key-value.js';

export class KeyValueDto {
  @ApiProperty({ description: 'Key code', example: 'foo' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Value', example: 0 })
  @IsNumber()
  value: number;

  static fromEntity(entity: KeyValue): KeyValueDto {
    const dto = new KeyValueDto();
    dto.key = entity.key;
    dto.value = entity.value;
    return dto;
  }
}
