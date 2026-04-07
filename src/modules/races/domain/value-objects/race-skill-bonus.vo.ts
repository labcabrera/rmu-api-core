export class RaceSkillBonus {
  constructor(
    public readonly skillId: string,
    public readonly specialization: string | null,
    public bonus: number,
  ) {}
}
