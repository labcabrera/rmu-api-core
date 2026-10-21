import { Injectable } from '@nestjs/common';
import { RealmGuardPort } from '../../application/ports/realm-guard.port';
import { Realm } from '../../domain/aggregates/realm';
import { BaseEntityGuard } from '../../../shared/infrastructure/security/base-entity-guard';

@Injectable()
export class RealmGuardAdapter extends BaseEntityGuard<Realm> implements RealmGuardPort {}
