import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { UpdateTraitCommand } from 'src/modules/traits/application/cqrs/commands/update-trait.command';
import { TraitCategory } from 'src/modules/traits/domain/value-objects/trait-category.vo';
import { TraitSpecialization } from 'src/modules/traits/domain/value-objects/trait-specialization.vo';

export class UpdateTraitDto {
  @ApiProperty({
    description: 'Name of the trait',
    required: false,
    example: 'Courage',
  })
  @IsString()
  @IsOptional()
  name: string | undefined;

  @ApiProperty({
    description: 'Category of the trait',
    required: false,
    example: 'combat',
    enum: ['combat', 'discipline', 'magical', 'physical', 'racial', 'senses', 'other'],
  })
  @IsString()
  @IsOptional()
  category: TraitCategory | undefined;

  @ApiProperty({ description: 'Indicates if the trait is a talent', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isTalent: boolean | undefined;

  @ApiProperty({ description: 'Trait specialization', required: false, example: 'none' })
  @IsOptional()
  @IsString()
  specialization: TraitSpecialization | undefined;

  @ApiProperty({ description: 'Indicates if the trait is tier based', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isTierBased: boolean | undefined;

  @ApiProperty({ description: 'Maximum tier for the trait if it is tier based', required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait', required: false, example: 7 })
  @IsNumber()
  @IsOptional()
  adquisitionCost: number | undefined;

  @ApiProperty({ description: 'Cost per tier of the trait', required: false, example: 3 })
  @IsNumber()
  @IsOptional()
  tierCost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(id: string, dto: UpdateTraitDto, userId: string, roles: string[]) {
    return new UpdateTraitCommand(
      id,
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
      roles,
    );
  }
}
