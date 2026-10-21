import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from '../../../../shared/interfaces/http/dto/page.dto';
import type { AccessType } from '../../../../shared/domain/entities/access-type';
import { CultureView } from '../../../application/read-models/culture-view';
import { CultureSkillRankDto } from './culture-skill-rank.dto';

export class CultureDto {
  @ApiProperty({ description: 'Culture identifier', example: 'culture-001' })
  id: string;

  @ApiProperty({ description: 'Name of the culture', example: 'Nomad' })
  name: string;

  @ApiProperty({ description: 'Culture ranks entries', type: [CultureSkillRankDto] })
  skillRanks: CultureSkillRankDto[];

  @ApiProperty({ description: 'Languages offered by the culture. Missing or empty means all', required: false, type: [String] })
  languages?: string[];

  @ApiProperty({ description: 'Free text with suggested crafts', required: false })
  suggestedCrafts?: string;

  @ApiProperty({ description: 'Free text with suggested vocations', required: false })
  suggestedVocations?: string;

  @ApiProperty({
    description: 'Indicative development cost of the culture ranks (Core Law §12.6). Computed, read only',
    readOnly: true,
    example: 80,
  })
  developmentCost: number;

  @ApiProperty({ description: 'Description of the culture' })
  description: string | null;

  @ApiProperty({ description: 'Image URL of the culture', required: false, example: 'images/cultures/nomad.png' })
  imageUrl: string | null;

  @ApiProperty({ description: 'Owner identifier', example: 'user-123' })
  owner: string;

  @ApiProperty({ type: String, description: 'Access type', required: true, example: 'private' })
  accessType: AccessType;

  static fromView(view: CultureView): CultureDto {
    const entity = view.culture;
    const dto = new CultureDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.skillRanks = entity.skillRanks?.map(f => CultureSkillRankDto.fromEntity(f)) ?? [];
    if (entity.languages !== undefined) dto.languages = entity.languages;
    if (entity.suggestedCrafts !== undefined) dto.suggestedCrafts = entity.suggestedCrafts;
    if (entity.suggestedVocations !== undefined) dto.suggestedVocations = entity.suggestedVocations;
    dto.developmentCost = view.developmentCost;
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
