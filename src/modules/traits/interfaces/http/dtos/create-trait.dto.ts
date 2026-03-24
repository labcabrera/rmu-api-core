import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { CreateTraitCommand } from 'src/modules/traits/application/cqrs/commands/create-trait.command';
import type { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';
import type { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

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

  @ApiProperty({ description: 'Trait specialization', required: false, example: 'none' })
  @IsString()
  @IsOptional()
  specialization: TraitSpecialization | null;

  @ApiProperty({ description: 'Indicates if the trait is tier based', required: true, example: false })
  @IsBoolean()
  isTierBased: boolean;

  @ApiProperty({ description: 'Maximum tier of the trait', required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait in development points', example: 7 })
  @IsNumber()
  adquisitionCost: number;

  @ApiProperty({ description: 'Cost per tier of the trait in development points', required: false, example: 3 })
  @IsNumber()
  @IsOptional()
  tierCost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
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
