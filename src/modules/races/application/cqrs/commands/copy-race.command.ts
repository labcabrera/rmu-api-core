import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/** Copies race `id` into `realmId` as a new race named `name` (workspace spec 074). */
export class CopyRaceCommand extends AuthenticatedCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly realmId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
