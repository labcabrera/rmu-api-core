import type { EntityGuard } from '../../../shared/application/ports/entity-guard.port.js';
import { Profession } from '../../domain/aggregates/profession.js';

export const PROFESSION_GUARD = Symbol('ProfessionGuardPort');

export type ProfessionGuardPort = EntityGuard<Profession>;
