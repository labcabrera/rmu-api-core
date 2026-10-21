import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteManeuverModifierCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
