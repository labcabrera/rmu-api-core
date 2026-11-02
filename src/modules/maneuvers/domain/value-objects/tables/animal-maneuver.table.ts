import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const ANIMAL_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'animal',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'Your confidence breaks at a crucial moment and the animal seizes the moment to lash out (attacking at +30) before bolting in a random direction.',
        messageTranslations: {
          es: 'Tu confianza se quiebra en un momento crucial y el animal aprovecha para atacarte (ataca con +30) antes de salir huyendo en una dirección aleatoria.',
        },
        effects: [
          {
            status: 'receivedAttack',
            value: 30,
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
          'Perhaps it is your impatient manner, perhaps it is your overabrupt movements, perhaps your smelly cologne, but the animal is unimpressed and uninfluenced.',
        messageTranslations: {
          es: 'Quizá sea tu impaciencia, quizá tus movimientos demasiado bruscos, quizá tu apestosa colonia, pero el animal ni se impresiona ni se deja influir.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'For a moment you think the animal is receptive to your guidance, but a sudden distraction breaks the moment. You may try again at +10 if appropriate.',
        messageTranslations: {
          es: 'Por un instante crees que el animal acepta tu guía, pero una distracción repentina rompe el momento. Puedes volver a intentarlo con +10 si procede.',
        },
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
          "Whispering calming words while projecting a sure and confident demeanor, you have the animal's attention and cooperation. Do not waste your opportunity.",
        messageTranslations: {
          es: 'Susurrando palabras tranquilizadoras y mostrando una actitud firme y segura, cuentas con la atención y la cooperación del animal. No desperdicies la oportunidad.',
        },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          "Your insight into this animal's nature has won you its lasting respect. You will receive +30 to any future Animal maneuvers versus this target until an Absolute Failure is achieved.",
        messageTranslations: {
          es: 'Tu comprensión de la naturaleza de este animal te ha ganado su respeto duradero. Recibes +30 a cualquier maniobra de Animal futura contra este objetivo hasta que obtengas un Fallo absoluto.',
        },
        effects: [
          {
            status: 'bonusUntilAbsoluteFailure',
            value: 30,
          },
        ],
      },
    },
  ],
  'The animal recognizes you not as its master but in some other role such as offspring, parent, or mate. Its attempts to protect and feed, follow and imitate, or woo and placate you may be helpful or problematic, depending on the success of your maneuver.',
  {
    es: 'El animal no te reconoce como su amo, sino en otro papel, como cría, progenitor o pareja. Sus intentos de protegerte y alimentarte, seguirte e imitarte, o cortejarte y apaciguarte pueden ser útiles o problemáticos, según el éxito de tu maniobra.',
  },
);
