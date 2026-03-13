import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class CreateLanguageCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly realmId: string,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
