import { AbsoluteManeuverResult } from '../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const ANIMAL_PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        'Your confidence breaks at a crucial moment and the animal seizes the moment to lash out (attacking at +30) before bolting in a random direction.',
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message:
        'Perhaps it is your impatient manner, perhaps it is your overabrupt movements, perhaps your smelly cologne, but the animal is unimpressed and uninfluenced.',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        'For a moment you think the animal is receptive to your guidance, but a sudden distraction breaks the moment. You may try again at +10 if appropriate.',
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message:
        "Whispering calming words while projecting a sure and confident demeanor, you have the animal's attention and cooperation. Do not waste your opportunity.",
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        "Your insight into this animal's nature has won you its lasting respect. You will receive +30 to any future Animal maneuvers versus this target until an Absolute Failure is achieved.",
      bonusUntilAbsoluteFailure: 30,
    },
  },
];

export class AnimalManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = ANIMAL_PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          ' The animal recognizes you not as its master but in some other role such as offspring, parent, or mate. Its attempts to protect and feed, follow and imitate, or woo and placate you may be helpful or problematic, depending on the success of your maneuver.'
        : entry.result.message,
    };
  }
}
