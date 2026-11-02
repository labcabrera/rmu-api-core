import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';
import type { ShareLevel } from '../../../../shared/domain/entities/entity-share.js';

/** Gives a friend read or write access to a realm, or changes the level given (spec 069). */
export class ShareRealmCommand extends AuthenticatedCommand {
  constructor(
    public readonly realmId: string,
    public readonly targetUserId: string,
    public readonly level: ShareLevel,
    userId: string,
    roles: string[],
    /** The version the client read; undefined skips the concurrency check. */
    public readonly expectedVersion?: number,
  ) {
    super(userId, roles);
  }
}
