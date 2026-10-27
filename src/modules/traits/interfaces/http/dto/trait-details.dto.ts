import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import {
  TRAIT_PREREQUISITE_TYPES,
  type TraitDetails,
  type TraitPrerequisiteType,
  type TraitSource,
} from '../../../domain/value-objects/trait-details.vo.js';

export class TraitPrerequisiteDto {
  @ApiProperty({ description: 'How a tier can be acquired', enum: TRAIT_PREREQUISITE_TYPES, example: 'training' })
  @IsIn(TRAIT_PREREQUISITE_TYPES)
  type: TraitPrerequisiteType;

  @ApiProperty({ description: 'Ids it names: professions (comma separated), a skill or a race', required: false, example: 'ranger,druid' })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiProperty({ description: 'The milestone or any other condition', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

/** Character Companion fields of a talent (spec 039), shared by the create and update bodies. */
export class TraitDetailsDto {
  @ApiProperty({ type: String, description: 'Training category of the talent', required: false, example: 'combat-expertise' })
  @IsString()
  @IsOptional()
  talentCategory?: string | null;

  @ApiProperty({ type: [TraitPrerequisiteDto], description: 'Prerequisites, one of them per tier', required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TraitPrerequisiteDto)
  @IsOptional()
  prerequisites?: TraitPrerequisiteDto[];

  @ApiProperty({ type: [String], description: 'Ids of the flaws that may be taken with the talent', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  possibleFlaws?: string[];

  @ApiProperty({ type: String, description: 'Rulebook of the trait', enum: ['core-law', 'character-companion'], required: false })
  @IsIn(['core-law', 'character-companion'])
  @IsOptional()
  source?: TraitSource | null;

  static toDetails(dto: TraitDetailsDto): TraitDetails {
    const { talentCategory, prerequisites, possibleFlaws, source } = dto;
    return { talentCategory, prerequisites, possibleFlaws, source };
  }
}
