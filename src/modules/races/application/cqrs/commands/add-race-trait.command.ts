import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class AddRaceTraitCommand extends AuthenticatedCommand {
  constructor(
    public readonly raceId: string,
    public readonly traitId: string,
    public readonly specialization: string | undefined,
    public readonly isTalent: boolean,
    public readonly tier: number | undefined,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
