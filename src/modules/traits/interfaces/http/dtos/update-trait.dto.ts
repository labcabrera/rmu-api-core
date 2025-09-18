import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { UpdateTraitCommand } from 'src/modules/traits/application/cqrs/commands/update-trait.command';

export class UpdateTraitDto {
  @ApiProperty({ description: 'Cost of the trait', required: false, example: 7 })
  @IsNumber()
  @IsOptional()
  cost: number | undefined;

  @ApiProperty({ description: 'Description of the trait', required: false, example: 'A trait representing courage and bravery' })
  @IsString()
  @IsOptional()
  description: string | undefined;

  static toCommand(id: string, dto: UpdateTraitDto, userId: string, userRoles: string[]) {
    return new UpdateTraitCommand(id, dto.cost, dto.description, userId, userRoles);
  }
}
