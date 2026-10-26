export const DEFAULT_FIGHTING_STYLES_ID = 'character-companion';

export class GetFightingStylesQuery {
  constructor(
    public readonly userId: string,
    public readonly roles: string[],
    public readonly id: string = DEFAULT_FIGHTING_STYLES_ID,
  ) {}
}
