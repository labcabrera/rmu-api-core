import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class GetEffectTypeQuery extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
