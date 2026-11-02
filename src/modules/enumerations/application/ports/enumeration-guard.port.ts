import type { RealmChildGuard } from '../../../shared/application/ports/realm-child-guard.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';

export const ENUMERATION_GUARD = Symbol('EnumerationGuardPort');

/** An enumeration of a realm follows the access of the realm; a global one keeps its own (spec 069). */
export type EnumerationGuardPort = RealmChildGuard<Enumeration>;
