import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Culture } from '../../domain/aggregates/culture.js';

export type CultureGuardPort = EntityGuard<Culture>;
