import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Profession } from '../../domain/aggregates/profession';

export interface ProfessionGuardPort extends EntityGuard<Profession> {}
