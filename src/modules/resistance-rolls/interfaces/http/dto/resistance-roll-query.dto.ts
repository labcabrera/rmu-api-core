import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ResistanceRollQuery } from '../../../application/cqrs/queries/resistance-roll.query.js';
import { KeyValueDto } from '../../../../shared/interfaces/http/dto/key-value.dto.js';

export class ResistanceRollQueryDto {
  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  attackLevel: number;

  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  targetLevel: number;

  @ApiProperty({ description: 'Modifiers', type: [KeyValueDto], example: [{ key: 'modifier1', value: 2 }], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyValueDto)
  @IsOptional()
  modifiers: KeyValueDto[] | null;

  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  roll: number;

  static toQuery(dto: ResistanceRollQueryDto, userId: string, roles: string[]): ResistanceRollQuery {
    return new ResistanceRollQuery(dto.attackLevel, dto.targetLevel, dto.modifiers, dto.roll, userId, roles);
  }
}
