import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import type { MagicPresence } from '../../../domain/value-objects/realm-magic-type.vo.js';
import type { AccessType } from '../../../../shared/domain/entities/access-type.js';
import { ENTITY_SOURCES, type EntitySource } from '../../../../shared/domain/entities/entity-source.js';
import { SHARE_LEVELS, type ShareLevel } from '../../../../shared/domain/entities/entity-share.js';

/** One access given by the owner (spec 069). */
@Schema({ _id: false, versionKey: false })
export class RealmShareModel {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ type: String, enum: SHARE_LEVELS, required: true })
  level: ShareLevel;

  @Prop({ required: true })
  grantedAt: Date;
}

const RealmShareSchema = SchemaFactory.createForClass(RealmShareModel);

/** A strategic game on the realm (spec 071). */
@Schema({ _id: false, versionKey: false })
export class RealmGameModel {
  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ type: [String], default: [] })
  memberIds: string[];
}

const RealmGameSchema = SchemaFactory.createForClass(RealmGameModel);

export type RealmDocument = HydratedDocument<RealmModel>;

@Schema({ collection: 'realms', versionKey: false })
export class RealmModel {
  /** Optimistic concurrency (spec 018): every update increments it. Missing in documents stored before. */
  @Prop({ type: Number, default: 0 })
  version: number;

  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true })
  magicPresence: MagicPresence;

  @Prop({ required: false })
  shortDescription?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: String, required: false })
  imageUrl: string | undefined;

  @Prop({ required: true })
  owner: string;

  /** Rulebook (`system`) or user content (spec 063). Documents stored before have none: they read as `user`. */
  @Prop({ type: String, enum: ENTITY_SOURCES, required: true, default: 'user' })
  entitySource: EntitySource;

  @Prop({ type: String, required: true })
  accessType: AccessType;

  /** Spec 055: missing in documents stored before, which read as false. */
  @Prop({ type: Boolean, default: false })
  generic: boolean;

  /** Spec 069: missing in documents stored before, which read as no shares. */
  @Prop({ type: [RealmShareSchema], default: [] })
  shares: RealmShareModel[];

  /** Spec 071: strategic games on the realm; missing before, which reads as none. */
  @Prop({ type: [RealmGameSchema], default: [] })
  games: RealmGameModel[];

  /** Spec 071: derived from games, it backs the access filter of the listings. */
  @Prop({ type: [String], default: [] })
  gameReaderIds: string[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: false })
  updatedAt?: Date;
}

export const RealmSchema = SchemaFactory.createForClass(RealmModel);
// owner and accessType back the access filter of every listing (an $or that uses one index per branch).
RealmSchema.index({ owner: 1 });
RealmSchema.index({ accessType: 1 });
RealmSchema.index({ gameReaderIds: 1 });
RealmSchema.index({ 'games.gameId': 1 });
// The realms shared with a user: listings and the revocation of spec 069.
RealmSchema.index({ 'shares.userId': 1 });
