import type { BaseRepository } from '../../../shared/application/ports/base-repository.js';
import { Culture } from '../../domain/aggregates/culture.js';

export type CultureRepository = BaseRepository<Culture>;
