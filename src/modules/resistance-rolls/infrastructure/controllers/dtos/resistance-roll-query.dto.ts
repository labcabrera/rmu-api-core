import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ResistanceRollQuery } from 'src/modules/resistance-rolls/application/cqrs/queries/resistance-roll.query';
import { KeyValueDto } from 'src/modules/shared/interfaces/http/dto/key-value.dto';

export class ResistanceRollQueryDto {
  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  attackLevel: number;

  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  targetLevel: number;

  @ApiProperty({ description: 'Modifiers', example: [{ key: 'modifier1', value: 2 }], required: false })
  @IsArray()
  @IsOptional()
  modifiers: KeyValueDto[] | null;

  @ApiProperty({ description: 'Roll', example: 42, required: true })
  @IsNumber()
  roll: number;

  static toQuery(dto: ResistanceRollQueryDto, userId: string, roles: string[]): ResistanceRollQuery {
    return new ResistanceRollQuery(dto.attackLevel, dto.targetLevel, dto.modifiers, dto.roll, userId, roles);
  }
}
