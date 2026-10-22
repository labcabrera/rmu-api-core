import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';

export const ENUMERATION_GUARD = Symbol('EnumerationGuardPort');

export type EnumerationGuardPort = EntityGuard<Enumeration>;
