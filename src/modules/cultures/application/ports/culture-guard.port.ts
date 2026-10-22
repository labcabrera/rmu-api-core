import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Culture } from '../../domain/aggregates/culture.js';

export const CULTURE_GUARD = Symbol('CultureGuardPort');

export type CultureGuardPort = EntityGuard<Culture>;
