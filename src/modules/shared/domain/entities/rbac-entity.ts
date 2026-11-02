import type { EntitySource } from './entity-source.js';
import type { EntityShare } from './entity-share.js';

export interface RbacEntity {
  owner: string;
  accessType: string;
  entitySource: EntitySource;
  /** Who else reads or writes it (spec 069). Only root entities that can be shared have it. */
  shares?: readonly EntityShare[];
}
