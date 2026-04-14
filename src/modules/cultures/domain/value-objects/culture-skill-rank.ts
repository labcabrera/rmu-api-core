export class CultureSkillRank {
  constructor(
    public readonly skillId: string,
    public readonly specialization: string | null,
    public readonly rank: number,
  ) {}
}
