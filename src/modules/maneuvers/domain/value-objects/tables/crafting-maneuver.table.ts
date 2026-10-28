import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const CRAFTING_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'crafting',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message:
          'You fail miserably but are so oblivious you are convinced you have succeeded admirably. Your new misguided approach gives you -25 to this skill until an absolute success is achieved.',
        messageTranslations: {
          es: 'Fracasas estrepitosamente, pero eres tan inconsciente que estás convencido de haberlo hecho de maravilla. Tu nuevo enfoque equivocado te da -25 a esta habilidad hasta que obtengas un Éxito absoluto.',
        },
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
          'Your skills have deserted you. You waste your effort, and create extra work for yourself. You may attempt to salvage the materials with a crafting maneuver -25.',
        messageTranslations: {
          es: 'Tu destreza te ha abandonado. Malgastas tu esfuerzo y te creas trabajo extra. Puedes intentar recuperar los materiales con una maniobra de Artesanía a -25.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message:
          'You know what you want to accomplish, but it just keeps falling short. Your work is functional, but deficient with increased chance of breakage (-10 Strength).',
        messageTranslations: {
          es: 'Sabes lo que quieres conseguir, pero siempre se queda corto. Tu trabajo es funcional, pero deficiente y con más probabilidad de rotura (-10 a la Resistencia).',
        },
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
        messageTranslations: {
          es: 'Tus manos son seguras y tu trabajo es preciso y artístico. La obra sale exactamente como pretendías y no hay sorpresas por el camino.',
        },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message:
          'Your diligence is rewarded with your latest masterwork! Everyone can see the remarkable quality of your work, and your abilities will be more highly regarded than ever. Item has +10 Strength.',
        messageTranslations: {
          es: '¡Tu diligencia se ve recompensada con tu última obra maestra! Todo el mundo puede ver la extraordinaria calidad de tu trabajo y tus habilidades serán más apreciadas que nunca. El objeto tiene +10 a la Resistencia.',
        },
        effects: [
          {
            status: 'itemBreakage',
            value: 10,
          },
        ],
      },
    },
  ],
  'You have a great idea for a unique style for your craftwork, and after an arduous effort you realize the work. The result has a unique built-in feature that either hinders the work (if a Failure), or makes it more desirable or useful (if Success).',
  {
    es: 'Se te ocurre una gran idea para dar un estilo único a tu artesanía y, tras un arduo esfuerzo, la haces realidad. El resultado tiene una característica única que perjudica la obra (si es un Fallo) o la hace más deseable o útil (si es un Éxito).',
  },
);
