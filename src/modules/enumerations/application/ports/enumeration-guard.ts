import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';

export type EnumerationGuardPort = EntityGuard<Enumeration>;
