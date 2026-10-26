import { AbsoluteManeuverTable } from '../absolute-maneuver-table.vo.js';

export const ABSOLUTE_MANEUVER_TABLE = new AbsoluteManeuverTable(
  'generic',
  [
    {
      min: null,
      max: 0,
      result: {
        result: 'absolute-failure',
        message: 'Not only do you utterly fail, but you manage to make the situation worse. You are an embarrassment to yourself.',
        messageTranslations: {
          es: 'No solo fracasas por completo, sino que consigues empeorar la situación. Eres una vergüenza para ti mismo.',
        },
      },
    },
    {
      min: 1,
      max: 75,
      result: {
        result: 'failure',
        message: "You fail the maneuver and must pay the consequences. Hopefully this wasn't a life or death situation.",
        messageTranslations: {
          es: 'Fallas la maniobra y debes pagar las consecuencias. Esperemos que no fuera una situación de vida o muerte.',
        },
      },
    },
    {
      min: 76,
      max: 100,
      result: {
        result: 'partial-success',
        message: 'If this maneuver is something you can partially succeed at then you do so. Otherwise the maneuver fails. Too bad.',
        messageTranslations: {
          es: 'Si es una maniobra en la que puedes tener un éxito parcial, lo consigues. Si no, la maniobra falla. Qué lástima.',
        },
      },
    },
    {
      min: 101,
      max: 175,
      result: {
        result: 'success',
        message: 'The attempt succeeds and you pat yourself on the back for a job well done. Congratulations!',
        messageTranslations: { es: 'El intento tiene éxito y te felicitas por un trabajo bien hecho. ¡Enhorabuena!' },
      },
    },
    {
      min: 176,
      max: null,
      result: {
        result: 'absolute-success',
        message: 'You succeed in the best way possible, and impress everyone who sees you.',
        messageTranslations: { es: 'Tienes éxito de la mejor manera posible e impresionas a todo el que te ve.' },
      },
    },
  ],
  'There is an unexpected side effect to you maneuver determined by the GM.',
  { es: 'Tu maniobra tiene un efecto secundario inesperado que decide el máster.' },
);
