import { ApiProperty } from '@nestjs/swagger';
import { CreateRealmCommand } from 'src/modules/core/application/commands/create-realm.command';
import { UpdateRealmCommand } from 'src/modules/core/application/commands/update-realm.command';
import { Realm } from 'src/modules/core/domain/entities/realm';

export class RealmDto {
  @ApiProperty({ description: 'Unique identifier for the realm', example: 'lotr' })
  id: string;

  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  name: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  static fromEntity(entity: Realm): RealmDto {
    const dto = new RealmDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    return dto;
  }
}

export class CreateRealmDto {
  @ApiProperty({ description: 'Unique identifier for the realm', example: 'lotr' })
  id: string;

  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  name: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  static toCommand(dto: CreateRealmDto, userId: string, userRoles: string[]) {
    return new CreateRealmCommand(dto.id, dto.name, dto.description, userId, userRoles);
  }
}

export class UpdateRealmDto {
  @ApiProperty({ description: 'Name of the realm', example: 'Lord of the Rings' })
  name: string;

  @ApiProperty({ description: 'Description of the realm', required: false, example: 'A fantasy world created by J.R.R. Tolkien' })
  description?: string;

  static toCommand(id: string, dto: UpdateRealmDto, userId: string, userRoles: string[]) {
    return new UpdateRealmCommand(id, dto.name, dto.description, userId, userRoles);
  }
}
