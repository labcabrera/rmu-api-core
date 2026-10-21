import { ManeuverProfile } from '../value-objects/maneuver-profile.vo';

export class SkillCategory {
  constructor(
    public readonly id: string,
    public readonly bonus: string[],
    public readonly realmBonus: number | null = null,
    public readonly maneuver?: ManeuverProfile,
  ) {}
}
