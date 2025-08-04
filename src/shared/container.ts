import 'reflect-metadata';
import { Container } from 'inversify';

import { RaceRepository } from '@domain/ports/outbound/race-repository';
import { RealmRepository } from '@domain/ports/outbound/realm-repository';
import { SkillRepository } from '@domain/ports/outbound/skill-repository';
import { SkillCategoryRepository } from '@domain/ports/outbound/skill-category-repository';
import { CharacterSizeRepository } from '@domain/ports/outbound/character-size-repository';
import { ArmorTypeRepository } from '@domain/ports/outbound/armor-type-repository';

import { RaceService } from '@application/services/race-read.service';
import { RealmReadService } from '@application/services/realm-read.service';
import { SkillReadService } from '@application/services/skill-read.service';
import { SkillCategoryService } from '@application/services/skill-category-read.service';
import { CharacterSizeService } from '@application/services/character-size-read.service';
import { ArmorTypeService } from '@application/services/armor-type-read.service';

import { RaceController } from '@infrastructure/adapters/inbound/http/controllers/race.controller';
import { RealmController } from '@infrastructure/adapters/inbound/http/controllers/realm.controller';
import { SkillController } from '@infrastructure/adapters/inbound/http/controllers/skill-controller';
import { SkillCategoryController } from '@infrastructure/adapters/inbound/http/controllers/skill-category.controller';
import { CharacterSizeController } from '@infrastructure/adapters/inbound/http/controllers/character-size.controller';
import { ArmorTypeController } from '@infrastructure/adapters/inbound/http/controllers/armor-type.controller';

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
import { AuthService } from '@infrastructure/adapters/inbound/http/security/auth.service';
import { HealthController } from '@infrastructure/adapters/inbound/http/controllers/health.controller';
import { Configuration } from './configuration';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { EventNotificationRegistry } from '@infrastructure/adapters/outbound/notifications/event-notification-registry';
import { RegistryEventNotificationAdapter } from '@infrastructure/adapters/outbound/notifications/registry-event-notification.adapter';
import { RealmDeletedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/realm-deleted-event-notification.service';
import { RaceCreatedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/race-created-event-notification.service';
import { RealmEventService } from '@application/services/realm-event.service';
import { RealmEventServiceImpl } from '@application/services/realm-event.service.impl';
import { RaceEventService } from '@application/services/race-event.service';
import { RaceEventServiceImpl } from '@application/services/race-event.service.impl';
import { RaceUpdatedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/race-updated-event-notification.service';
import { RealmUpdatedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/realm-updated-event-notification.service';
import { RealmCreatedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/realm-created-event-notification.service';
import { RaceDeletedEventNotificationService } from '@infrastructure/adapters/outbound/notifications/race-deleted-event-notification.service';

const container = new Container();

// Bind Configuration
container.bind<Configuration>('Configuration').to(Configuration).inSingletonScope();

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

// Bind Domain Event Services
container.bind<RealmEventService>('RealmEventService').to(RealmEventServiceImpl).inSingletonScope();
container.bind<RaceEventService>('RaceEventService').to(RaceEventServiceImpl).inSingletonScope();

// Bind Event Notification Services with Registry Pattern
container.bind<RealmCreatedEventNotificationService>('RealmCreatedEventNotificationService').to(RealmCreatedEventNotificationService).inSingletonScope();
container.bind<RealmUpdatedEventNotificationService>('RealmUpdatedEventNotificationService').to(RealmUpdatedEventNotificationService).inSingletonScope();
container.bind<RealmDeletedEventNotificationService>('RealmDeletedEventNotificationService').to(RealmDeletedEventNotificationService).inSingletonScope();

container.bind<RaceCreatedEventNotificationService>('RaceCreatedEventNotificationService').to(RaceCreatedEventNotificationService).inSingletonScope();
container.bind<RaceUpdatedEventNotificationService>('RaceUpdatedEventNotificationService').to(RaceUpdatedEventNotificationService).inSingletonScope();
container.bind<RaceDeletedEventNotificationService>('RaceDeletedEventNotificationService').to(RaceDeletedEventNotificationService).inSingletonScope();


// Bind the registry with factory to configure services
container.bind<EventNotificationRegistry>('EventNotificationRegistry').toDynamicValue(() => {
  const registry = new EventNotificationRegistry();
  registry.registerService("RealmCreatedEvent", container.get<RealmCreatedEventNotificationService>('RealmCreatedEventNotificationService'));
  registry.registerService("RealmUpdatedEvent", container.get<RealmUpdatedEventNotificationService>('RealmUpdatedEventNotificationService'));
  registry.registerService("RealmDeletedEvent", container.get<RealmDeletedEventNotificationService>('RealmDeletedEventNotificationService'));
  registry.registerService("RaceCreatedEvent", container.get<RaceCreatedEventNotificationService>('RaceCreatedEventNotificationService'));
  registry.registerService("RaceUpdatedEvent", container.get<RaceUpdatedEventNotificationService>('RaceUpdatedEventNotificationService'));
  registry.registerService("RaceDeletedEvent", container.get<RaceDeletedEventNotificationService>('RaceDeletedEventNotificationService'));
  console.log('Event Notification Registry configured with all services');
  return registry;
}).inSingletonScope();

// Bind the main port using the registry adapter
container.bind<EventNotificationPort>('EventNotificationPort').to(RegistryEventNotificationAdapter).inSingletonScope();

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
container.bind<HealthController>('HealthController').to(HealthController).inSingletonScope();

container.bind<AuthService>('AuthService').to(AuthService).inSingletonScope();

export { container };
