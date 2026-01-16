export class CreateSkillCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly bonus: string[],
    public readonly userId: string,
    public readonly roles?: string[],
  ) {}
}
