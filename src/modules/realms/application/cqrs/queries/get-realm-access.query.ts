import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/**
 * The access of a user to a realm, asked by another API with its service token (spec 071): strategic, items and npcs
 * check that the user reads the realm their entity uses. Only admins (the service account) may ask.
 */
export class GetRealmAccessQuery extends AuthenticatedCommand {
  constructor(
    public readonly realmId: string,
    public readonly subjectId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
