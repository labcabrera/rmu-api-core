import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteCultureCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
