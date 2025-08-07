import { AuthenticatedCommand } from './authenticated-command';

export class CreateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
