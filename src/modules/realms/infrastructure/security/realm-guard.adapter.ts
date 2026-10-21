import { Injectable } from '@nestjs/common';
import type { RealmGuardPort } from '../../application/ports/realm-guard.port.js';
import { Realm } from '../../domain/aggregates/realm.js';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard.js';

@Injectable()
export class RealmGuardAdapter extends BaseEntityGuard<Realm> implements RealmGuardPort {}
