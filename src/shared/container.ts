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
import { InMemoryRealmRepository } from '@infrastructure/database/repositories/InMemoryRealmRepository';

// Adapters
import { RaceController } from '@adapters/controllers/RaceController';
import { RealmController } from '@adapters/controllers/RealmController';

const container = new Container();

// Bind Repositories
container.bind<RaceRepository>(TYPES.RaceRepository).to(InMemoryRaceRepository).inSingletonScope();
container.bind<RealmRepository>(TYPES.RealmRepository).to(InMemoryRealmRepository).inSingletonScope();

// Bind Services
container.bind<RaceService>(TYPES.RaceService).to(RaceService).inSingletonScope();
container.bind<RealmService>(TYPES.RealmService).to(RealmService).inSingletonScope();

// Bind Controllers
container.bind<RaceController>(TYPES.RaceController).to(RaceController).inSingletonScope();
container.bind<RealmController>(TYPES.RealmController).to(RealmController).inSingletonScope();

export { container };
