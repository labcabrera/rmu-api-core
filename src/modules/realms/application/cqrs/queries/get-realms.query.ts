import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/** Narrows a listing (spec 069): the user's realms, the ones shared with them or the public ones. */
export const REALM_SCOPES = ['mine', 'shared', 'public'] as const;

export type RealmScope = (typeof REALM_SCOPES)[number];

export class GetRealmsQuery extends AuthenticatedCommand {
  constructor(
    public readonly rsql: string | undefined,
    public readonly page: number,
    public readonly size: number,
    userId: string,
    roles: string[],
    public readonly scope?: RealmScope,
  ) {
    super(userId, roles);
  }
}
