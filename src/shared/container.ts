import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@shared/types/container';

// Domain
import { RaceRepository } from '@domain/ports/RaceRepository';
import { RealmRepository } from '@domain/ports/RealmRepository';

// Application
import { RaceService } from '@application/services/RaceService';
import { RealmService } from '@application/services/RealmService';

// Infrastructure
import { InMemoryRaceRepository } from '@infrastructure/database/repositories/InMemoryRaceRepository';
import { MongoRealmRepository } from '@infrastructure/database/repositories/MongoRealmRepository';

// Adapters
import { RaceController } from '@adapters/controllers/RaceController';

const container = new Container();

// Bind Repositories
container.bind<RaceRepository>(TYPES.RaceRepository).to(InMemoryRaceRepository).inSingletonScope();
container.bind<RealmRepository>(TYPES.RealmRepository).to(MongoRealmRepository).inSingletonScope();

// Bind Services
container.bind<RaceService>(TYPES.RaceService).to(RaceService).inSingletonScope();
container.bind<RealmService>(TYPES.RealmService).to(RealmService).inSingletonScope();

// Bind Controllers
container.bind<RaceController>(TYPES.RaceController).to(RaceController).inSingletonScope();

export { container };
