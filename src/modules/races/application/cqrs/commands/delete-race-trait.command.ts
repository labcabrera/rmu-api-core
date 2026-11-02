import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

export class DeleteRaceTraitCommand extends AuthenticatedCommand {
  constructor(
    public readonly raceId: string,
    public readonly traitId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
