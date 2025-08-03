import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '@shared/types/container';

import { RaceRepository } from '@domain/ports/RaceRepository';
import { RealmRepository } from '@domain/ports/RealmRepository';
import { SkillRepository } from '@domain/ports/SkillRepository';
import { SkillCategoryRepository } from '@domain/ports/SkillCategoryRepository';
import { CharacterSizeRepository } from '@domain/ports/CharacterSizeRepository';
import { ArmorTypeRepository } from '@domain/ports/ArmorTypeRepository';

import { RaceService } from '@application/services/race-service';
import { RealmService } from '@application/services/realm-service';
import { SkillService } from '@application/services/skill-service';
import { SkillCategoryService } from '@application/services/skill-category-service';
import { CharacterSizeService } from '@application/services/character-size-service';
import { ArmorTypeService } from '@application/services/armor-type-service';

import { RaceController } from '@infrastructure/adapters/controllers/race-controller';
import { RealmController } from '@infrastructure/adapters/controllers/realm-controller';
import { SkillController } from '@infrastructure/adapters/controllers/skill-controller';
import { SkillCategoryController } from '@infrastructure/adapters/controllers/skill-category-controller';
import { CharacterSizeController } from '@infrastructure/adapters/controllers/character-size-controller';
import { ArmorTypeController } from '@infrastructure/adapters/controllers/armor-type-controller';

import { MongoRaceRepository } from '@infrastructure/adapters/persistence/repositories/MongoRaceRepository';
import { MongoRealmRepository } from '@infrastructure/adapters/persistence/repositories/MongoRealmRepository';
import { InMemorySkillRepository } from '@infrastructure/adapters/persistence/repositories/InMemorySkillRepository';
import { InMemorySkillCategoryRepository } from '@infrastructure/adapters/persistence/repositories/InMemorySkillCategoryRepository';
import { InMemoryCharacterSizeRepository } from '@infrastructure/adapters/persistence/repositories/InMemoryCharacterSizeRepository';
import { InMemoryArmorTypeRepository } from '@infrastructure/adapters/persistence/repositories/InMemoryArmorTypeRepository';

const container = new Container();

// Bind Repositories
container.bind<RaceRepository>(TYPES.RaceRepository).to(MongoRaceRepository).inSingletonScope();
container.bind<RealmRepository>(TYPES.RealmRepository).to(MongoRealmRepository).inSingletonScope();
container.bind<SkillRepository>(TYPES.SkillRepository).to(InMemorySkillRepository).inSingletonScope();
container.bind<SkillCategoryRepository>(TYPES.SkillCategoryRepository).to(InMemorySkillCategoryRepository).inSingletonScope();
container.bind<CharacterSizeRepository>(TYPES.CharacterSizeRepository).to(InMemoryCharacterSizeRepository).inSingletonScope();
container.bind<ArmorTypeRepository>(TYPES.ArmorTypeRepository).to(InMemoryArmorTypeRepository).inSingletonScope();

// Bind Services
container.bind<RaceService>(TYPES.RaceService).to(RaceService).inSingletonScope();
container.bind<RealmService>(TYPES.RealmService).to(RealmService).inSingletonScope();
container.bind<SkillService>(TYPES.SkillService).to(SkillService).inSingletonScope();
container.bind<SkillCategoryService>(TYPES.SkillCategoryService).to(SkillCategoryService).inSingletonScope();
container.bind<CharacterSizeService>(TYPES.CharacterSizeService).to(CharacterSizeService).inSingletonScope();
container.bind<ArmorTypeService>(TYPES.ArmorTypeService).to(ArmorTypeService).inSingletonScope();

// Bind Controllers
container.bind<RaceController>(TYPES.RaceController).to(RaceController).inSingletonScope();
container.bind<RealmController>(TYPES.RealmController).to(RealmController).inSingletonScope();
container.bind<SkillController>(TYPES.SkillController).to(SkillController).inSingletonScope();
container.bind<SkillCategoryController>(TYPES.SkillCategoryController).to(SkillCategoryController).inSingletonScope();
container.bind<CharacterSizeController>(TYPES.CharacterSizeController).to(CharacterSizeController).inSingletonScope();
container.bind<ArmorTypeController>(TYPES.ArmorTypeController).to(ArmorTypeController).inSingletonScope();

export { container };
