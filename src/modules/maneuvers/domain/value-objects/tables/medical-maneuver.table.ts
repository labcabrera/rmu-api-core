import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo';

export const MEDICAL_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'medical',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'The herb is not only ruined, it has become slightly toxic. If treating a patient, you manage to make things worse, increasing any injury penalty by -10.',
        effects: [
          {
            status: 'injuryPenalty',
            value: 10,
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
          'The herb or poison and your pride are ruined. If treating a patient, the Recovery Roll is made at -100 (as if they received no care).',
        effects: [
          {
            status: 'recoveryRollModifier',
            value: -100,
          },
        ],
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'The herb or poison is half as potent. If treating a patient, your misguided care provides minimal improvement. The Recovery Roll is made at a modifier of -25.',
        effects: [
          {
            status: 'recoveryRollModifier',
            value: -25,
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
          'The herb or poison is ready! If treating a patient, you are alert enough to catch problems as they arise and they should recover normally (+0 to the Recovery Roll).',
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'The herb or poison has doubled potency. If treating a patient, you know exactly what to do and they respond miraculously to your care (add +25 to the Recovery Roll).',
        effects: [
          {
            status: 'recoveryRollModifier',
            value: 25,
          },
        ],
      },
    },
  ],
  "Your preparation of the herb or poison has altered its properties in a way that may be useful (on a Success) or not (on a Failure). If treating a patient, in addition to success or failure treating the condition, you've improved or worsened a different condition by +/-10.",
);
