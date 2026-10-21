import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command';

export class GetManeuverModifiersQuery extends AuthenticatedCommand {
  constructor(
    public readonly rsql: string | undefined,
    public readonly page: number,
    public readonly size: number,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
