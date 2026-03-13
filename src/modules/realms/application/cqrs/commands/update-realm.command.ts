import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class UpdateRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string | undefined,
    public readonly shortDescription: string | undefined,
    public readonly description: string | undefined,
    public readonly imageUrl: string | undefined,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
