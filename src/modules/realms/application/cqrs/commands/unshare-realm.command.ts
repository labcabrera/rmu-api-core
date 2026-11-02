import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/** Removes the access of a user to a realm: by who manages it, or by that user giving it up (spec 069). */
export class UnshareRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly realmId: string,
    public readonly targetUserId: string,
    userId: string,
    roles: string[],
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
