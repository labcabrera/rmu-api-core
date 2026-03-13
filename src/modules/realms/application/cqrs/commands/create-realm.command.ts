import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class CreateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly name: string,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
