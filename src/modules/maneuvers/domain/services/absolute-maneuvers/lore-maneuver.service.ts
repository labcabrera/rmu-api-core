import { AbsoluteManeuverResult } from '../../value-objects/absolute-maneuver-result.vo';
import { ManeuverService } from './maneuver-service';

const PERCENT_TABLE: { min: number; max: number; result: AbsoluteManeuverResult }[] = [
  {
    min: -Infinity,
    max: 0,
    result: {
      result: 'absolute-failure',
      message:
        "What's all this? You irretrievably confuse yourself and cannot possibly recall this information without at least 12 hours to refamiliarize yourself with the topic.",
    },
  },
  {
    min: 1,
    max: 75,
    result: {
      result: 'failure',
      message: 'Hmmm. Nope. Nothing springs to mind. Perhaps if you were to spend another six hours studying the matter…',
    },
  },
  {
    min: 76,
    max: 100,
    result: {
      result: 'partial-success',
      message:
        'You recall some details of the subject, but nothing specific. Stew on this for an hour or so and something might come to you. (roll again in 1 hour).',
    },
  },
  {
    min: 101,
    max: 175,
    result: {
      result: 'success',
      message:
        'Ah, of course! A simple fact, of course, right on the tip of your tongue. You recall all relevant details about the subject.',
    },
  },
  {
    min: 176,
    max: Infinity,
    result: {
      result: 'absolute-success',
      message:
        "With a nonchalant air, you relate the details of the topic from memory, including relevant quotations and analysis by authorities of note. Now who's the savant around here?",
    },
  },
];

export class LoreManeuverService implements ManeuverService {
  execute(roll: number, unusualEvent: boolean): AbsoluteManeuverResult {
    const entry = PERCENT_TABLE.find((row) => roll >= row.min && roll <= row.max);
    if (!entry) {
      throw new Error('Roll out of bounds');
    }
    return {
      ...entry.result,
      message: unusualEvent
        ? entry.result.message +
          " Great Horny Toads! You've been using that word for years and suddenly realized you were pronouncing it completely wrong! You whoop and gurgle happily, rolling your mouth around the new sound…why is everyone staring at you?"
        : entry.result.message,
    };
  }
}
