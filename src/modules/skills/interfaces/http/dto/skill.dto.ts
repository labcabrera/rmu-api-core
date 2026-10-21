import { ApiProperty } from '@nestjs/swagger';
import { EnumerationCategory } from 'src/modules/enumerations/domain/value-objects/enumeration-category.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';
import { SkillView } from 'src/modules/skills/application/read-models/skill-view';
import { EffectiveManeuverProfileDto, ManeuverProfileDto } from 'src/modules/skill-categories/interfaces/http/dto/maneuver-profile.dto';

export class SkillDto {
  @ApiProperty({ description: 'Unique identifier of the skill', example: 'animal-handling' })
  id: string;

  @ApiProperty({ description: 'Category of the skill', example: 'animal' })
  categoryId: string;

  @ApiProperty({ description: 'List of stats that apply a benefit to the skill', example: ['em', 'co'] })
  bonus: string[];

  @ApiProperty({ description: 'List of specializations for the skill', example: ['stealth', 'tracking'] })
  specialization: EnumerationCategory | null;

  @ApiProperty({ description: 'Access type of the skill', example: 'public' })
  accessType: AccessType;

  @ApiProperty({
    description: 'Effective maneuver profile: category profile overridden by the skill values, with defaults',
    type: EffectiveManeuverProfileDto,
  })
  maneuver: EffectiveManeuverProfileDto;

  @ApiProperty({
    description: 'Maneuver values stored on the skill itself (overrides of the category profile). Omitted when none.',
    type: ManeuverProfileDto,
    required: false,
  })
  maneuverOverrides?: ManeuverProfileDto;

  static fromView(view: SkillView): SkillDto {
    const entity = view.skill;
    const dto = new SkillDto();
    dto.id = entity.id;
    dto.categoryId = entity.categoryId;
    dto.bonus = entity.bonus || [];
    dto.specialization = entity.specialization;
    dto.accessType = entity.accessType;
    dto.maneuver = EffectiveManeuverProfileDto.fromProfile(view.maneuver);
    dto.maneuverOverrides = ManeuverProfileDto.fromProfile(entity.maneuver);
    return dto;
  }
}

export class SkillPageDto {
  @ApiProperty({
    type: [SkillDto],
    description: 'Skills',
    isArray: true,
  })
  content: SkillDto[];
  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
