import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { CreateTraitCommand } from '../../../application/cqrs/commands/create-trait.command.js';
import type { TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';

export class CreateTraitDto {
  @ApiProperty({ description: 'Name of the trait', example: 'Ambidextrous' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category of the trait',
    example: 'combat',
    enum: ['combat', 'discipline', 'magical', 'physical', 'racial', 'senses', 'other'],
  })
  @IsString()
  @IsNotEmpty()
  category: TraitCategory;

  @ApiProperty({ description: 'Indicates if the trait is a talent', required: true, example: true })
  @IsBoolean()
  isTalent: boolean;

  @ApiProperty({ type: String, description: 'Trait specialization', required: false, example: 'none' })
  @IsString()
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
    );
  }
}
