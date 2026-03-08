import { ApiProperty } from '@nestjs/swagger';
import { ProfessionSkillCostsDto } from './profession-skill-cost.dto';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { UpdateProfessionCommand } from 'src/modules/professions/application/cqrs/commands/update-profession.command';
import { RealmType } from 'src/modules/professions/domain/value-objects/realm-type.vo';

export class UpdateProfessionDto {
  @ApiProperty({ description: 'Available realm types for the profession', required: false, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableRealmTypes: RealmType[] | undefined;

  @ApiProperty({ description: 'Fixed realm types for the profession', required: false, example: ['channeling'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fixedRealmTypes: RealmType[] | undefined;

  @ApiProperty({ description: 'Skill costs associated with the profession', required: false })
  @IsObject()
  @IsOptional()
  skillCosts: ProfessionSkillCostsDto | undefined;

  @ApiProperty({ description: 'List of available professional skills', required: false, example: ['riding', 'perception'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  professionalSkills: string[] | undefined;

  @ApiProperty({ description: 'Description of the profession', example: 'A brave warrior skilled in combat.', required: false })
  @IsString()
  @IsOptional()
  description: string | undefined;

  @ApiProperty({ description: 'Image URL for the profession', example: 'https://example.com/warrior.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl: string | undefined;

  static toCommand(professionId: string, dto: UpdateProfessionDto, userId: string, roles: string[]): UpdateProfessionCommand {
    return new UpdateProfessionCommand(
      professionId,
      dto.availableRealmTypes,
      dto.fixedRealmTypes,
      dto.skillCosts,
      dto.professionalSkills,
      dto.description,
      dto.imageUrl,
      userId,
      roles,
    );
  }
}
