export const DEFAULT_PSYCHOLOGY_TABLES_ID = 'core-law';

export class GetPsychologyTablesQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
    public readonly id: string = DEFAULT_PSYCHOLOGY_TABLES_ID,
  ) {}
}
