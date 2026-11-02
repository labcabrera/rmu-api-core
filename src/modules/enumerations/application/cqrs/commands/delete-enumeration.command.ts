import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly enumerationId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
