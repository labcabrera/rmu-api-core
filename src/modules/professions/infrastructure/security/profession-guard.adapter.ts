import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { ProfessionGuardPort } from '../../application/ports/profession-guard.port.js';
import { Profession } from '../../domain/aggregates/profession.js';

export class ProfessionGuardAdapter extends BaseEntityGuard<Profession> implements ProfessionGuardPort {}
