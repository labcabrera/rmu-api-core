import type { EntityGuard } from '../../../shared/application/ports/entity-guard.js';
import { Profession } from '../../domain/aggregates/profession.js';

export type ProfessionGuardPort = EntityGuard<Profession>;
