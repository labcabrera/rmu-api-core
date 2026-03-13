export type ManeuverEffectStatus =
  | 'penaltyUntilAbsoluteSuccess'
  | 'bonusUntilAbsoluteFailure'
  | 'retryBonus'
  | 'adrenalExtraRounds'
  | 'adrenalDoubleBenefits'
  | 'receivedAttack'
  | 'skillPenalty'
  | 'itemBreakage'
  | 'stunned'
  | 'injuryPenalty'
  | 'recoveryRollModifier';

export interface ManeuverEffect {
  status: ManeuverEffectStatus;
  value?: number;
  modifier?: string;
  rounds?: number;
  roundDelay?: number;
}
