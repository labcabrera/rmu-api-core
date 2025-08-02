import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@shared/types/container';

import { RaceRepository } from '@domain/ports/RaceRepository';
import { RealmRepository } from '@domain/ports/RealmRepository';

import { RaceService } from '@application/services/RaceService';
import { RealmService } from '@application/services/RealmService';
import { RaceController } from '@adapters/controllers/RaceController';
import { RealmController } from '@adapters/controllers/RealmController';
import { MongoRaceRepository } from '@infrastructure/database/repositories/MongoRaceRepository';
import { MongoRealmRepository } from '@infrastructure/database/repositories/MongoRealmRepository';

const container = new Container();

// Bind Repositories
container.bind<RaceRepository>(TYPES.RaceRepository).to(MongoRaceRepository).inSingletonScope();
container.bind<RealmRepository>(TYPES.RealmRepository).to(MongoRealmRepository).inSingletonScope();

// Bind Services
container.bind<RaceService>(TYPES.RaceService).to(RaceService).inSingletonScope();
container.bind<RealmService>(TYPES.RealmService).to(RealmService).inSingletonScope();

// Bind Controllers
container.bind<RaceController>(TYPES.RaceController).to(RaceController).inSingletonScope();
container.bind<RealmController>(TYPES.RealmController).to(RealmController).inSingletonScope();

export { container };
