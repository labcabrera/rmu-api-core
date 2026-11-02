export const ACCESS_TYPES = ['public', 'private'] as const;

export type AccessType = (typeof ACCESS_TYPES)[number];
