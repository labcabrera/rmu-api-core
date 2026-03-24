import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo';

export const COMPOSITION_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'composition',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'You artist types! In a fit of anger you destroy any work you have already accomplished. Your emotions get the better of you and you are -25 to this skill*.',
        effects: [
          {
            status: 'skillPenalty',
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
          'Whatever is locked in your head remains so. You find yourself utterly unable to transfer your concept to the medium. Perhaps another day will yield improvements.',
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'Your temper flares as your attempts fall short of your expectations. While your work has merit, you have not effectively grasped your own intent.',
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message:
          'Twas nothing! You have once again demonstrated your ample genius to all with the ability to see. If only the whole world were not blind compared to you.',
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'Ahh, Bach! The masterstroke of your piece falls into place with the surety of perfection. This piece will make your reputation, if not your fortune. Who says you have to die to be great?',
      },
    },
  ],
  'Your interpretation is a profound departure from your normal style, from any style in fact. People will be unable to understand it and only leave confused. In a few days of contemplation they will see it as either the brilliant (success) or bad (failure) piece that it was.',
);
