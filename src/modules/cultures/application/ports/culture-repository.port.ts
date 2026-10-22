import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import { Culture } from '../../domain/aggregates/culture.js';

export const CULTURE_REPOSITORY = Symbol('CultureRepository');

export type CultureRepository = BaseRepository<Culture>;
