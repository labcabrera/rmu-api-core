/** System command: deletes the races of a deleted realm. */
export class DeleteRacesByRealmCommand {
  constructor(public readonly realmId: string) {}
}
