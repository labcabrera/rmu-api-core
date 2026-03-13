import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class UpdateLanguageCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly description: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
