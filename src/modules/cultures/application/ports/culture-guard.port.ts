import { EntityGuard } from 'src/modules/shared/application/ports/entity-guard';
import { Culture } from '../../domain/aggregates/culture';

export type CultureGuardPort = EntityGuard<Culture>;
