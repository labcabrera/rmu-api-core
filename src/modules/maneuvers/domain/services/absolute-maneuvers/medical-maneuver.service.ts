import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'The herb is not only ruined, it has become slightly toxic. If treating a patient, you manage to make things worse, increasing any injury penalty by -10.',
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message:
        'The herb or poison and your pride are ruined. If treating a patient, the Recovery Roll is made at -100 (as if they received no care).',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        'The herb or poison is half as potent. If treating a patient, your misguided care provides minimal improvement. The Recovery Roll is made at a modifier of -25.',
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
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        'The herb or poison has doubled potency. If treating a patient, you know exactly what to do and they respond miraculously to your care (add +25 to the Recovery Roll).',
    },
  },
];

export class MedicalManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          " Your preparation of the herb or poison has altered its properties in a way that may be useful (on a Success) or not (on a Failure). If treating a patient, in addition to success or failure treating the condition, you've improved or worsened a different condition by +/-10."
        : entry.result.message,
    };
  }
}
