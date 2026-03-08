import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const CRAFTING_PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'You fail miserably but are so oblivious you are convinced you have succeeded admirably. Your new misguided approach gives you -25 to this skill until an absolute success is achieved.',
      effects: [
        {
          status: 'penaltyUntilAbsoluteSuccess',
          value: 25,
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
        'Your skills have deserted you. You waste your effort, and create extra work for yourself. You may attempt to salvage the materials with a crafting maneuver -25.',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        'You know what you want to accomplish, but it just keeps falling short. Your work is functional, but deficient with increased chance of breakage (-10 Strength).',
      effects: [
        {
          status: 'itemBreakage',
          value: -10,
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
        'Your hands are sure, and your work is precise and artful. Your work comes out exactly as you intended and there are no surprises along the way.',
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        'Your diligence is rewarded with your latest masterwork! Everyone can see the remarkable quality of your work, and your abilities will be more highly regarded than ever. Item has +10 Strength.',
      effects: [
        {
          status: 'itemBreakage',
          value: 10,
        },
      ],
    },
  },
];

export class CraftingManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = CRAFTING_PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          ' You have a great idea for a unique style for your craftwork, and after an arduous effort you realize the work. The result has a unique built-in feature that either hinders the work (if a Failure), or makes it more desirable or useful (if Success).'
        : entry.result.message,
    };
  }
}
