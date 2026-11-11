import { AuthenticatedCommand } from '../../../../shared/application/cqrs/authenticated-command.js';

/**
 * Every realm a user reads, with the level, asked by another API with its service token (spec 073): items and npcs
 * resolve the access to their entities, filter their listings and fill `access` with one call per user. Only admins
 * (the service account) may ask.
 */
export class GetRealmAccessMapQuery extends AuthenticatedCommand {
  constructor(
    public readonly subjectId: string,
    userId: string,
    roles: string[],
  ) {
    super(userId, roles);
  }
}
