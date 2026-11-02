import type { BaseRepository } from '../../../shared/application/ports/base-repository.port.js';
import { Enumeration } from '../../domain/aggregates/enumeration.js';

export const ENUMERATION_REPOSITORY = Symbol('EnumerationRepository');

export interface EnumerationRepository extends BaseRepository<Enumeration> {
  findByKeyCategoryAndRealm(key: string, category: string, realmId: string | null): Promise<Enumeration | null>;
}
