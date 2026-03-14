import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo';

export const ADRENAL_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'adrenal',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'What were you thinking? Your feeble attempt at focus creates a mental block that hinders your future attempts, giving you a -25 to this skill until an Absolute Success is achieved.',
        effects: [
          {
            status: 'penaltyUntilAbsoluteSuccess',
            value: -25,
          },
        ],
      },
    },
    {
      min: 1,
      max: 75,
      result: {
        result: 'failure',
        message:
          'You fail to summon the inner focus necessary for this feat, and receive no benefit or effects from your attempt. Thanks for playing.',
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'You are distracted at a critical moment, but receive half the normal benefit. Or, if not in combat, you may abort and try again with a +10. Try switching to decaf.',
        effects: [
          {
            status: 'retryBonus',
            value: 10,
          },
        ],
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message:
          'You are a paragon of self-control and receive full benefits of the maneuver for 1 round for every 20 you succeeded by (1 round for 101-120, 2 for 121-140, etc.).',
        effects: [
          {
            status: 'adrenalExtraRounds',
          },
        ],
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'Wow! You not only succeed, but you have tapped into a reservoir of strength within yourself. As Success, plus you receive double benefits for the first round.',
        effects: [
          {
            status: 'adrenalDoubleBenefits',
            rounds: 1,
          },
        ],
      },
    },
  ],
  'As you begin to summon your focus, you notice an unfamiliar darkness within yourself. You enter a cleansing trance that lasts the entire round. If you succeed at your maneuver treat as an Absolute Success. If you fail, treat as an Absolute Failure.',
);
