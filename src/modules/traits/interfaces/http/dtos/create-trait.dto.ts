import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { CreateTraitCommand } from 'src/modules/traits/application/cqrs/commands/create-trait.command';

export class CreateTraitDto {
  @ApiProperty({ description: 'Unique identifier for the trait', example: 'ambidextrous' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Cost of the trait', example: 7 })
  @IsNumber()
  @IsOptional()
  cost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(dto: CreateTraitDto, userId: string, userRoles: string[]) {
    return new CreateTraitCommand(dto.id, dto.cost, dto.description, userId, userRoles);
  }
}
