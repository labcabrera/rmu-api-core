import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

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
        messageTranslations: {
          es: '¡Ay, los artistas! En un arrebato de ira destruyes todo el trabajo que ya habías hecho. Tus emociones te superan y sufres -25 a esta habilidad*.',
        },
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
        messageTranslations: {
          es: 'Lo que tienes en la cabeza se queda ahí encerrado. Te ves totalmente incapaz de plasmar tu idea en el medio. Quizá otro día vaya mejor.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'Your temper flares as your attempts fall short of your expectations. While your work has merit, you have not effectively grasped your own intent.',
        messageTranslations: {
          es: 'Pierdes los nervios cuando tus intentos no están a la altura de tus expectativas. Aunque tu obra tiene mérito, no has logrado captar de verdad tu propia intención.',
        },
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message:
          'Twas nothing! You have once again demonstrated your ample genius to all with the ability to see. If only the whole world were not blind compared to you.',
        messageTranslations: {
          es: '¡No fue nada! Una vez más has demostrado tu enorme genio a todo el que tenga ojos para verlo. Si al menos el resto del mundo no estuviera tan ciego comparado contigo...',
        },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'Ahh, Bach! The masterstroke of your piece falls into place with the surety of perfection. This piece will make your reputation, if not your fortune. Who says you have to die to be great?',
        messageTranslations: {
          es: '¡Ahh, Bach! El golpe maestro de tu obra encaja en su sitio con la certeza de la perfección. Esta obra te dará reputación, si no fortuna. ¿Quién dice que hay que morir para ser grande?',
        },
      },
    },
  ],
  'Your interpretation is a profound departure from your normal style, from any style in fact. People will be unable to understand it and only leave confused. In a few days of contemplation they will see it as either the brilliant (success) or bad (failure) piece that it was.',
  {
    es: 'Tu interpretación supone una ruptura profunda con tu estilo habitual; de hecho, con cualquier estilo. La gente será incapaz de entenderla y se marchará desconcertada. Tras unos días de reflexión la verán como la obra brillante (éxito) o mala (fallo) que era.',
  },
);
