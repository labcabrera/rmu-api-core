import { BaseRepository } from 'src/modules/shared/application/ports/repository';
import { Enumeration } from '../../domain/aggregates/enumeration';

export type EnumerationRepository = BaseRepository<Enumeration>;
