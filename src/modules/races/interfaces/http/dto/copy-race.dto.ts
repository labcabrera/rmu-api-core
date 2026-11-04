import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { CopyRaceCommand } from '../../../application/cqrs/commands/copy-race.command.js';

/** Body of `POST /v1/races/:id/copy` (workspace spec 074). */
export class CopyRaceDto {
  @ApiProperty({ description: 'Name of the new race', example: 'High elf (copy)' })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Realm of the new race: the user must be able to change it', example: 'middle-earth' })
  @IsString()
  @IsNotEmpty()
  realmId: string;

  static toCommand(id: string, dto: CopyRaceDto, userId: string, roles: string[]) {
    return new CopyRaceCommand(id, dto.name, dto.realmId, userId, roles);
  }
}
