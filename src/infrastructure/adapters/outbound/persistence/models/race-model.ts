import { Schema, model, Document } from 'mongoose';

interface RaceStatBonusDocument {
  ag: number;
  co: number;
  em: number;
  in: number;
  me: number;
  pr: number;
  qu: number;
  re: number;
  sd: number;
  st: number;
}

interface RaceResistancesDocument {
  channeling: number;
  mentalism: number;
  essence: number;
  physical: number;
}

interface SexBasedAttributeDocument {
  male: number;
  female: number;
}

export interface RaceDocument extends Document {
  _id: string;
  name: string;
  realm: string;
  size?: string;
  defaultStatBonus: RaceStatBonusDocument;
  resistances?: RaceResistancesDocument;
  averageHeight?: SexBasedAttributeDocument;
  averageWeight?: SexBasedAttributeDocument;
  strideBonus?: number;
  enduranceBonus?: number;
  recoveryMultiplier?: number;
  baseHits?: number;
  bonusDevPoints?: number;
  description?: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const raceStatBonusSchema = new Schema<RaceStatBonusDocument>(
  {
    ag: { type: Number, required: true },
    co: { type: Number, required: true },
    em: { type: Number, required: true },
    in: { type: Number, required: true },
    me: { type: Number, required: true },
    pr: { type: Number, required: true },
    qu: { type: Number, required: true },
    re: { type: Number, required: true },
    sd: { type: Number, required: true },
    st: { type: Number, required: true },
  },
  { _id: false }
);

const raceResistancesSchema = new Schema<RaceResistancesDocument>(
  {
    channeling: { type: Number, required: true },
    mentalism: { type: Number, required: true },
    essence: { type: Number, required: true },
    physical: { type: Number, required: true },
  },
  { _id: false }
);

const sexBasedAttributeSchema = new Schema<SexBasedAttributeDocument>(
  {
    male: { type: Number, required: true },
    female: { type: Number, required: true },
  },
  { _id: false }
);

const raceSchema = new Schema<RaceDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    realm: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: false,
    },
    defaultStatBonus: {
      type: raceStatBonusSchema,
      required: true,
    },
    resistances: raceResistancesSchema,
    averageHeight: sexBasedAttributeSchema,
    averageWeight: sexBasedAttributeSchema,
    strideBonus: Number,
    enduranceBonus: Number,
    recoveryMultiplier: Number,
    baseHits: Number,
    bonusDevPoints: Number,
    description: String,
    owner: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: false,
    }
  },
  {
    collection: 'races',
  }
);

export const RaceModel = model<RaceDocument>('Race', raceSchema);
