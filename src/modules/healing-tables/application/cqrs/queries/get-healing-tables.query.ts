export const DEFAULT_HEALING_TABLES_ID = 'core-law';

export class GetHealingTablesQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
    public readonly id: string = DEFAULT_HEALING_TABLES_ID,
  ) {}
}
