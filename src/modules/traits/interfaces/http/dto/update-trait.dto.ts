import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, Min, IsNotEmpty, ValidateIf } from 'class-validator';
import { UpdateTraitCommand } from '../../../application/cqrs/commands/update-trait.command.js';
import { TRAIT_CATEGORIES, type TraitCategory } from '../../../domain/value-objects/trait-category.vo.js';
import { TraitDetailsDto } from './trait-details.dto.js';
import type { TraitSpecialization } from '../../../domain/value-objects/trait-specialization.vo.js';

export class UpdateTraitDto extends TraitDetailsDto {
  @ApiProperty({ type: String, description: 'Name of the trait', required: false, example: 'Courage' })
  // Absent keeps the name; null or '' is a 400 (a name cannot be cleared).
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @IsNotEmpty()
  name: string | undefined;

  @ApiProperty({
    description: 'Category of the trait',
    required: false,
    example: 'combat',
    enum: TRAIT_CATEGORIES,
  })
  @IsString()
  @IsOptional()
  category: TraitCategory | undefined;

  @ApiProperty({ type: Boolean, description: 'Indicates if the trait is a talent', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isTalent: boolean | undefined;

  @ApiProperty({ type: String, description: 'Trait specialization', required: false, example: 'none' })
  @IsOptional()
  @IsString()
  specialization: TraitSpecialization | undefined;

  @ApiProperty({ type: Boolean, description: 'Indicates if the trait is tier based', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isTierBased: boolean | undefined;

  @ApiProperty({ type: Number, description: 'Maximum tier for the trait if it is tier based', required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxTier: number | undefined;

  @ApiProperty({ type: Number, description: 'Cost of the trait', required: false, example: 7 })
  @IsNumber()
  @IsOptional()
  adquisitionCost: number | undefined;

  @ApiProperty({ type: Number, description: 'Cost per tier of the trait', required: false, example: 3 })
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

  @ApiProperty({ description: 'Version the client read (from the GET); a different stored version is a 409', required: false, example: 3 })
  @IsInt()
  @Min(0)
  @IsOptional()
  version?: number;

  static toCommand(id: string, dto: UpdateTraitDto, userId: string, roles: string[]) {
    return new UpdateTraitCommand(
      id,
      dto.name,
      dto.category,
      dto.isTalent,
      dto.specialization,
      dto.isTierBased,
      dto.adquisitionCost,
      dto.tierCost,
      dto.maxTier,
      dto.description,
      userId,
      roles,
      dto.version,
      TraitDetailsDto.toDetails(dto),
    );
  }
}
