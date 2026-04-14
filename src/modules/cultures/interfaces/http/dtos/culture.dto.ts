import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { Culture } from 'src/modules/cultures/domain/aggregates/culture';
import { CultureSkillRankDto } from './culture-skill-rank.dto';

export class CultureDto {
  @ApiProperty({ description: 'Culture identifier', example: 'culture-001' })
  id: string;

  @ApiProperty({ description: 'Name of the culture', example: 'Nomad' })
  name: string;

  @ApiProperty({ description: 'Fixed skill ranks', required: false, type: [CultureSkillRankDto] })
  fixedSkillRanks: CultureSkillRankDto[];

  @ApiProperty({ description: 'Description of the culture' })
  description: string | null;

  @ApiProperty({ description: 'Image URL of the culture', required: false, example: 'https://example.com/images/races/elf.jpg' })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner identifier', example: 'user-123' })
  owner: string;

  @ApiProperty({ description: 'Access type', required: true, example: 'private' })
  accessType: AccessType;

  static fromEntity(entity: Culture): CultureDto {
    const dto = new CultureDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.fixedSkillRanks = entity.fixedSkillRanks?.map(f => CultureSkillRankDto.fromEntity(f)) ?? [];
    dto.description = entity.description;
    dto.imageUrl = entity.imageUrl;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    return dto;
  }
}

export class CulturePageDto {
  @ApiProperty({
    type: [CultureDto],
    description: 'Cultures',
    isArray: true,
  })
  content: CultureDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
