import { Schema, model, Document } from 'mongoose';

export interface RealmDocument extends Document {
  _id: string;
  name: string;
  description?: string;
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
  },
  {
    timestamps: true,
    collection: 'realms',
  }
);

export const RealmModel = model<RealmDocument>('Realm', realmSchema);
