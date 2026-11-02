import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/** Who a realm is shared with: only for who manages it (spec 069). */
export class GetRealmSharesQuery extends AuthenticatedCommand {
  constructor(
    public readonly realmId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
