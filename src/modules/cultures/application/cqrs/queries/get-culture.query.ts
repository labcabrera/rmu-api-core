import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class GetCultureQuery extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
