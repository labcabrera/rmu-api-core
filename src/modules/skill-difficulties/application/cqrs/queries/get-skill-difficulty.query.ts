export class GetSkillDifficultyQuery {
  constructor(
    public readonly skillId: string,
    public readonly userId: string,
    public readonly roles: string[],
  ) {}
}
