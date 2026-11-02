export const DEFAULT_POISON_TABLES_ID = 'core-law';

export class GetPoisonTablesQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
    public readonly id: string = DEFAULT_POISON_TABLES_ID,
  ) {}
}
