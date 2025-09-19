import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { CreateTraitCommand } from 'src/modules/traits/application/cqrs/commands/create-trait.command';

export class CreateTraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Indicates if the trait is a talent', required: true, example: true })
  @IsBoolean()
  isTalent: boolean;

  @ApiProperty({ description: 'Indicates if the trait requires specialization', required: true, example: true })
  @IsBoolean()
  requiresSpecialization: boolean;

  @ApiProperty({ description: 'Indicates if the trait is tier based', required: true, example: false })
  @IsBoolean()
  isTierBased: boolean;

  @ApiProperty({ description: 'Maximum tier of the trait', required: false, example: 5 })
  @IsNumber()
  @IsOptional()
  maxTier: number | undefined;

  @ApiProperty({ description: 'Cost of the trait', example: 7 })
  @IsNumber()
  @IsOptional()
  cost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateTraitDto, userId: string, userRoles: string[]) {
    return new CreateTraitCommand(
      dto.id,
      dto.isTalent,
      dto.requiresSpecialization,
      dto.isTierBased,
      dto.maxTier,
      dto.cost,
      dto.description,
      userId,
      userRoles,
    );
  }
}
