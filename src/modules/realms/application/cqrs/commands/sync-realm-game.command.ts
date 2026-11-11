/**
 * A strategic game was created, changed or deleted (spec 071): its realm records the game and its members, and the
 * realm it left (if it moved) forgets it. It comes from Kafka, so it carries no user and checks no permission.
 */
export class SyncRealmGameCommand {
  constructor(
    public readonly gameId: string,
    /** The realm of the game; null when the game was deleted. */
    public readonly realmId: string | null,
    public readonly ownerId: string,
    public readonly memberIds: string[],
  ) {}
}
