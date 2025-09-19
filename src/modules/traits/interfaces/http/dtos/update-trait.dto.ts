import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { UpdateTraitCommand } from 'src/modules/traits/application/cqrs/commands/update-trait.command';

export class UpdateTraitDto {
  @ApiProperty({ description: 'Indicates if the trait is a talent', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  isTalent: boolean | undefined;

  @ApiProperty({ description: 'Indicates if the trait requires specialization', required: false, example: true })
  @IsOptional()
  @IsBoolean()
  requiresSpecialization: boolean | undefined;

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
  cost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(id: string, dto: UpdateTraitDto, userId: string, userRoles: string[]) {
    return new UpdateTraitCommand(
      id,
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
