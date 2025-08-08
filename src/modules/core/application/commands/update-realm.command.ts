import { AuthenticatedCommand } from './authenticated-command';

export class UpdateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
