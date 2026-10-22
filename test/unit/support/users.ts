import { RMU_ADMIN, RMU_USER } from '../../../src/modules/shared/domain/entities/user-roles.js';

/** The users of the permission tests: an admin, the owner of the fixtures and another player. */
export const ADMIN = { id: 'admin-1', roles: [RMU_ADMIN] } as const;
export const OWNER = { id: 'owner-1', roles: [RMU_USER] } as const;
export const OTHER = { id: 'other-1', roles: [RMU_USER] } as const;
export const NO_ROLES = { id: 'guest-1', roles: [] as string[] } as const;
