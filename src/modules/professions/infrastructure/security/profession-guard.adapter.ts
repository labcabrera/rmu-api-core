import { BaseEntityGuard } from 'src/modules/shared/infrastructure/security/base-entity-guard';
import { ProfessionGuardPort } from '../../application/ports/profession-guard.port';
import { Profession } from '../../domain/aggregates/profession';

export class ProfessionGuardAdapter extends BaseEntityGuard<Profession> implements ProfessionGuardPort {}
