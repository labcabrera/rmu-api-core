import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';
import { KeyValue } from 'src/modules/shared/domain/entities/key-value';

export class ResistanceRollQuery extends AuthenticatedCommand {
  constructor(
    public readonly attackLevel: number,
    public readonly targetLevel: number,
    public readonly modifiers: KeyValue[] | null,
    public readonly roll: number,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
