/** Levels a share gives (spec 069): read, or read and write. Managing (delete, visibility, shares) stays with the owner. */
export const SHARE_LEVELS = ['read', 'write'] as const;

export type ShareLevel = (typeof SHARE_LEVELS)[number];

/**
 * Access to an entity given by its owner to a friend (spec 069). `userName` is a copy for display: permissions compare
 * the id only.
 */
export interface EntityShare {
  userId: string;
  userName: string;
  level: ShareLevel;
  grantedAt: Date;
}

/** Most shares an entity holds (spec 069, decision 3). */
export const MAX_SHARES = 50;
