import 'reflect-metadata';
import { Container } from 'inversify';

import { RaceRepository } from '@domain/ports/race-repository';
import { RealmRepository } from '@domain/ports/realm-repository';
import { SkillRepository } from '@domain/ports/skill-repository';
import { SkillCategoryRepository } from '@domain/ports/skill-category-repository';
import { CharacterSizeRepository } from '@domain/ports/character-size-repository';
import { ArmorTypeRepository } from '@domain/ports/armor-type-repository';

import { RaceService } from '@application/services/race-service';
import { RealmService } from '@application/services/realm-service';
import { SkillService } from '@application/services/skill-service';
import { SkillCategoryService } from '@application/services/skill-category-service';
import { CharacterSizeService } from '@application/services/character-size-service';
import { ArmorTypeService } from '@application/services/armor-type-service';

import { RaceController } from '@infrastructure/adapters/inbound/http/controllers/race-controller';
import { RealmController } from '@infrastructure/adapters/inbound/http/controllers/realm-controller';
import { SkillController } from '@infrastructure/adapters/inbound/http/controllers/skill-controller';
import { SkillCategoryController } from '@infrastructure/adapters/inbound/http/controllers/skill-category-controller';
import { CharacterSizeController } from '@infrastructure/adapters/inbound/http/controllers/character-size-controller';
import { ArmorTypeController } from '@infrastructure/adapters/inbound/http/controllers/armor-type-controller';

import { MongoRaceRepository } from '@infrastructure/adapters/outbound/persistence/repositories/mongo-race.repository';
import { MongoRealmRepository } from '@infrastructure/adapters/outbound/persistence/repositories/mongo-realm.repository';
import { InMemorySkillRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-skill.repository';
import { InMemorySkillCategoryRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-skill-category.repository';
import { InMemoryCharacterSizeRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-sharacter-size.repository';
import { InMemoryArmorTypeRepository } from '@infrastructure/adapters/outbound/persistence/repositories/in-memory-armor-type.repository';

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

// Bind Services
container.bind<RaceService>('RaceService').to(RaceService).inSingletonScope();
container.bind<RealmService>('RealmService').to(RealmService).inSingletonScope();
container.bind<SkillService>('SkillService').to(SkillService).inSingletonScope();
container
  .bind<SkillCategoryService>('SkillCategoryService')
  .to(SkillCategoryService)
  .inSingletonScope();
container
  .bind<CharacterSizeService>('CharacterSizeService')
  .to(CharacterSizeService)
  .inSingletonScope();
container.bind<ArmorTypeService>('ArmorTypeService').to(ArmorTypeService).inSingletonScope();

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

export { container };
