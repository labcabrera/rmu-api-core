import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';

export class CreateLanguageCommand {
  constructor(
    public readonly name: string,
    public readonly realm: NamedEntity,
    public readonly description: string | undefined,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
