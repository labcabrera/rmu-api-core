import { AuthenticatedCommand } from 'src/modules/shared/application/cqrs/authenticated-command';

export class DeleteEnumerationCommand extends AuthenticatedCommand {
  constructor(
    public readonly enumerationId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
