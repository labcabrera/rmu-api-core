import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard';
import { EnumerationGuardPort } from '../../application/ports/enumeration-guard';
import { Enumeration } from '../../domain/aggregates/enumeration';

export class EnumerationGuardAdapter extends BaseEntityGuard<Enumeration> implements EnumerationGuardPort {}
