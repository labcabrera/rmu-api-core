export class UpdateRaceRealmNameCommand {
  constructor(
    public readonly realmId: string,
    public readonly realmName: string,
    public readonly realmOwner: string,
  ) {}
}
