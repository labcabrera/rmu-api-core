import { toOptionalKey } from '../../../shared/domain/services/key.js';

export class RaceSkillBonus {
  public readonly specialization: string | null;

  constructor(
    public readonly skillId: string,
    specialization: string | null,
    public bonus: number,
  ) {
    // The specialization is a normalized key, as in the characters that receive the bonus (spec 050)
    this.specialization = toOptionalKey(specialization);
  }
}
