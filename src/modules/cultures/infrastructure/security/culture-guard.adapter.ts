import type { CultureGuardPort } from '../../application/ports/culture-guard.port.js';
import { Culture } from '../../domain/aggregates/culture.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';

export class CultureGuardAdapter extends BaseEntityGuard<Culture> implements CultureGuardPort {}
