import { BaseRepository } from 'src/modules/shared/application/ports/base-repository';
import { Culture } from '../../domain/aggregates/culture';

export type CultureRepository = BaseRepository<Culture>;
