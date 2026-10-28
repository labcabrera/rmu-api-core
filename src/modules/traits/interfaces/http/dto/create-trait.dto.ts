import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsIn } from 'class-validator';
import { CreateTraitCommand } from '../../../application/cqrs/commands/create-trait.command.js';
import { TRAIT_CATEGORIES, type TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import { TraitDetailsDto } from './trait-details.dto.js';
import { TRAIT_SPECIALIZATIONS, type TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';

export class CreateTraitDto extends TraitDetailsDto {
  @ApiProperty({ description: 'Name of the trait', example: 'Ambidextrous' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category of the trait',
    example: 'combat',
    enum: TRAIT_CATEGORIES,
  })
  @IsIn(TRAIT_CATEGORIES)
  category: TraitCategory;

  @ApiProperty({ description: 'Indicates if the trait is a talent', required: true, example: true })
  @IsBoolean()
  isTalent: boolean;

  @ApiProperty({
    type: String,
    description: 'Trait specialization',
    required: false,
    nullable: true,
    example: 'skill',
    enum: TRAIT_SPECIALIZATIONS,
  })
  @IsIn(TRAIT_SPECIALIZATIONS)
  @IsOptional()
  specialization: TraitSpecialization | null;

  @ApiProperty({ description: 'Indicates if the trait is tier based', required: true, example: false })
  @IsBoolean()
  isTierBased: boolean;

  @ApiProperty({ type: Number, description: 'Maximum tier of the trait', required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait in development points', example: 7 })
  @IsNumber()
  adquisitionCost: number;

  @ApiProperty({ type: Number, description: 'Cost per tier of the trait in development points', required: false, example: 3 })
  @IsNumber()
  @IsOptional()
  tierCost: number | undefined;

  @ApiProperty({
    type: String,
    description: 'Description of the trait',
    required: false,
    example: 'A trait representing courage and bravery',
  })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateTraitDto, userId: string, userRoles: string[]) {
    return new CreateTraitCommand(
      dto.name,
      dto.category,
      dto.isTalent,
      dto.specialization,
      dto.isTierBased,
      dto.maxTier,
      dto.adquisitionCost,
      dto.tierCost,
      dto.description,
      userId,
      userRoles,
      TraitDetailsDto.toDetails(dto),
    );
  }
}
