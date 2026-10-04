import { ApiProperty } from '@nestjs/swagger';
import { EffectType } from 'src/modules/effect-types/domain/aggregates/effect-type';
import {
  EFFECT_PROPERTY_REQUIREMENTS,
  type EffectPropertyRequirement,
} from 'src/modules/effect-types/domain/value-objects/effect-property-requirement.vo';
import type { AccessType } from 'src/modules/shared/domain/entities/access-type';
import type { EntitySource } from 'src/modules/shared/domain/entities/entity-source';
import { PaginationDto } from 'src/modules/shared/interfaces/http/dto/page.dto';

export class EffectTypeDto {
  @ApiProperty({ description: 'Effect type identifier', example: 'bleeding', required: true })
  id: string;

  @ApiProperty({ description: 'Indicates if the effect persists over time', example: true, required: true })
  isPersistent: boolean;

  @ApiProperty({ description: 'Indicates if the effect can be stacked', example: false, required: true })
  isStackable: boolean;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'required', required: true })
  value: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional', required: true })
  modifier: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: true })
  rounds: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'optional', required: true })
  text: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: true })
  location: EffectPropertyRequirement;

  @ApiProperty({ enum: EFFECT_PROPERTY_REQUIREMENTS, enumName: 'EffectPropertyRequirement', example: 'forbidden', required: true })
  delay: EffectPropertyRequirement;

  @ApiProperty({ description: 'Owner of the effect type', example: 'user123', required: true })
  owner: string;

  @ApiProperty({ description: 'Access type of the effect type', example: 'public', required: true })
  accessType: AccessType;

  @ApiProperty({ description: 'Entity source', example: 'user', required: true })
  entitySource: EntitySource;

  static fromEntity(entity: EffectType): EffectTypeDto {
    const dto = new EffectTypeDto();
    dto.id = entity.id;
    dto.isPersistent = entity.isPersistent;
    dto.isStackable = entity.isStackable;
    dto.value = entity.value;
    dto.modifier = entity.modifier;
    dto.rounds = entity.rounds;
    dto.text = entity.text;
    dto.location = entity.location;
    dto.delay = entity.delay;
    dto.owner = entity.owner;
    dto.accessType = entity.accessType;
    dto.entitySource = entity.entitySource;
    return dto;
  }
}

export class EffectTypePageDto {
  @ApiProperty({
    type: [EffectTypeDto],
    description: 'Effect types',
    isArray: true,
  })
  content: EffectTypeDto[];

  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination information',
  })
  pagination: PaginationDto;
}
