import type { AccessType } from '../../../shared/domain/entities/access-type.js';
import type { MagicPresence } from '../value-objects/realm-magic-type.vo.js';
import type { EntitySource } from '../../../shared/domain/entities/entity-source.js';
import type { EntityShare } from '../../../shared/domain/entities/entity-share.js';

/** A strategic game on the realm: its owner and the users of its member list (spec 071). */
export interface RealmGame {
  gameId: string;
  ownerId: string;
  memberIds: string[];
}

export interface RealmProps {
  id: string;
  name: string;
  magicPresence: MagicPresence;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  owner: string;
  accessType: AccessType;
  /** Rulebook (`system`, admin-only changes) or user content (spec 063). */
  entitySource: EntitySource;
  /** A realm of generic content (RMU Core, spec 055) usable from any campaign. Only an admin sets it. */
  generic: boolean;
  /** Friends the owner gave read or write access (spec 069). Stored before: none. */
  shares: EntityShare[];
  /** Strategic games on the realm and their members (spec 071), from the game events of strategic. */
  games: RealmGame[];
  /** Members of the games whose owner reads the realm: they read it too (spec 071, decision 2). Derived from games. */
  gameReaderIds: string[];
  createdAt: Date;
  updatedAt?: Date;
}
