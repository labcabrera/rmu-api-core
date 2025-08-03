import { Schema, model, Document } from 'mongoose';

export interface RealmDocument extends Document {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const realmSchema = new Schema<RealmDocument>(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
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
    },
  },
  {
    collection: 'realms',
  }
);

export const RealmModel = model<RealmDocument>('Realm', realmSchema);
