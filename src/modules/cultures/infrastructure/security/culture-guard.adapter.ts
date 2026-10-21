import { CultureGuardPort } from '../../application/ports/culture-guard.port';
import { Culture } from '../../domain/aggregates/culture';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard';

export class CultureGuardAdapter extends BaseEntityGuard<Culture> implements CultureGuardPort {}
