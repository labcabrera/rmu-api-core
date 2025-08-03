import { Realm, CreateRealmRequest, UpdateRealmRequest } from '@domain/entities/Realm';
import { PaginationOptions, PaginatedResult } from '@shared/types';

export interface RealmRepository {
  findById(id: string): Promise<Realm | null>;
  findAll(options: PaginationOptions): Promise<PaginatedResult<Realm>>;
  save(realm: CreateRealmRequest): Promise<Realm>;
  update(id: string, realm: UpdateRealmRequest): Promise<Realm | null>;
  deleteById(id: string): Promise<boolean>;
  existsById(id: string): Promise<boolean>;
}
