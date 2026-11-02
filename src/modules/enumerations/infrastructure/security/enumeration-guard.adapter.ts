import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';
import type { EnumerationGuardPort } from '../../application/ports/enumeration-guard.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';

export class EnumerationGuardAdapter extends BaseEntityGuard<Enumeration> implements EnumerationGuardPort {}
