import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

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
