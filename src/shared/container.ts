import 'reflect-metadata';
import { Container } from 'inversify';

import { RaceRepository } from '@domain/ports/race-repository';
import { RealmRepository } from '@domain/ports/realm-repository';
import { SkillRepository } from '@domain/ports/skill-repository';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';

import { RaceService } from '@application/services/race-read-service';
import { RealmReadService } from '@application/services/realm-read-service';
import { SkillReadService } from '@application/services/skill-read-service';
import { SkillCategoryService } from '@application/services/skill-category-read-service';
import { CharacterSizeService } from '@application/services/character-size-read-service';
import { ArmorTypeService } from '@application/services/armor-type-read-service';

import { RaceController } from '@infrastructure/adapters/inbound/http/controllers/race-controller';
import { RealmController } from '@infrastructure/adapters/inbound/http/controllers/realm-controller';
import { SkillController } from '@infrastructure/adapters/inbound/http/controllers/skill-controller';
import { SkillCategoryController } from '@infrastructure/adapters/inbound/http/controllers/skill-category-controller';
import { CharacterSizeController } from '@infrastructure/adapters/inbound/http/controllers/character-size-controller';
import { ArmorTypeController } from '@infrastructure/adapters/inbound/http/controllers/armor-type-controller';
import { AuthExampleController } from '@infrastructure/adapters/inbound/http/controllers/auth-example-controller';

import { MongoRaceRepository } from '@infrastructure/adapters/outbound/persistence/repositories/mongo-race.repository';
import { MongoRealmRepository } from '@infrastructure/adapters/outbound/persistence/repositories/mongo-realm.repository';
import { InMemorySkillRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-skill.repository';
import { InMemorySkillCategoryRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-skill-category.repository';
import { InMemoryCharacterSizeRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-sharacter-size.repository';
import { InMemoryArmorTypeRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-armor-type.repository';
import { CreateRaceUseCase } from '@application/use-cases/create-race.usecase';
import { DeleteRaceUseCase } from '@application/use-cases/delete-race.usecase';
import { CreateRealmUseCase } from '@application/use-cases/create-realm.usecase';
import { UpdateRealmUseCase } from '@application/use-cases/update-realm.usecase';
import { DeleteRealmUseCase } from '@application/use-cases/delete-realm.usecase';
import {
  AuthService,
  AuthConfig,
} from '@infrastructure/adapters/inbound/http/services/auth.service';

const container = new Container();

// Bind Repositories
container.bind<RaceRepository>('RaceRepository').to(MongoRaceRepository).inSingletonScope();
container.bind<RealmRepository>('RealmRepository').to(MongoRealmRepository).inSingletonScope();
container.bind<SkillRepository>('SkillRepository').to(InMemorySkillRepository).inSingletonScope();
container
  .bind<SkillCategoryRepository>('SkillCategoryRepository')
  .to(InMemorySkillCategoryRepository)
  .inSingletonScope();
container
  .bind<CharacterSizeRepository>('CharacterSizeRepository')
  .to(InMemoryCharacterSizeRepository)
  .inSingletonScope();
container
  .bind<ArmorTypeRepository>('ArmorTypeRepository')
  .to(InMemoryArmorTypeRepository)
  .inSingletonScope();

// Bind Use Cases
container.bind<CreateRaceUseCase>('CreateRaceUseCase').to(CreateRaceUseCase).inSingletonScope();
container.bind<DeleteRaceUseCase>('UpdateRaceUseCase').to(DeleteRaceUseCase).inSingletonScope();
container.bind<DeleteRaceUseCase>('DeleteRaceUseCase').to(DeleteRaceUseCase).inSingletonScope();

container.bind<CreateRealmUseCase>('CreateRealmUseCase').to(CreateRealmUseCase).inSingletonScope();
container.bind<UpdateRealmUseCase>('UpdateRealmUseCase').to(UpdateRealmUseCase).inSingletonScope();
container.bind<DeleteRealmUseCase>('DeleteRealmUseCase').to(DeleteRealmUseCase).inSingletonScope();

// Bind Services
container.bind<RaceService>('RaceReadService').to(RaceService).inSingletonScope();
container.bind<RealmReadService>('RealmReadService').to(RealmReadService).inSingletonScope();
container.bind<SkillReadService>('SkillReadService').to(SkillReadService).inSingletonScope();
container
  .bind<SkillCategoryService>('SkillCategoryReadService')
  .to(SkillCategoryService)
  .inSingletonScope();
container
  .bind<CharacterSizeService>('CharacterSizeReadService')
  .to(CharacterSizeService)
  .inSingletonScope();
container.bind<ArmorTypeService>('ArmorTypeReadService').to(ArmorTypeService).inSingletonScope();

// Bind Controllers
container.bind<RaceController>('RaceController').to(RaceController).inSingletonScope();
container.bind<RealmController>('RealmController').to(RealmController).inSingletonScope();
container.bind<SkillController>('SkillController').to(SkillController).inSingletonScope();
container
  .bind<SkillCategoryController>('SkillCategoryController')
  .to(SkillCategoryController)
  .inSingletonScope();
container
  .bind<CharacterSizeController>('CharacterSizeController')
  .to(CharacterSizeController)
  .inSingletonScope();
container
  .bind<ArmorTypeController>('ArmorTypeController')
  .to(ArmorTypeController)
  .inSingletonScope();
container
  .bind<AuthExampleController>('AuthExampleController')
  .to(AuthExampleController)
  .inSingletonScope();

// Bind Auth Configuration
const authConfig: AuthConfig = {
  keycloakUrl: process.env.KEYCLOAK_URL || 'http://localhost:8090',
  realm: process.env.KEYCLOAK_REALM || 'rmu-local',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'rmu-client',
};

container.bind<AuthConfig>('AuthConfig').toConstantValue(authConfig);
container.bind<AuthService>('AuthService').to(AuthService).inSingletonScope();

export { container };
