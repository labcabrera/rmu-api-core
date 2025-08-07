import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/modules/auth/auth.module';
import { CreateRaceUseCase } from './application/use-cases/create-race.usecase';
import { CreateRealmUseCase } from './application/use-cases/create-realm.usecase';
import { DeleteRaceUseCase } from './application/use-cases/delete-race.usecase';
import { DeleteRealmUseCase } from './application/use-cases/delete-realm.usecase';
import { UpdateRaceUseCase } from './application/use-cases/update-race.usecase';
import { UpdateRealmUseCase } from './application/use-cases/update-realm.usecase';
import { CharacterSizeController } from './infrastructure/controllers/character-size.controller';
import { RaceController } from './infrastructure/controllers/race.controller';
import { RealmController } from './infrastructure/controllers/realm.controller';
import { KafkaProducerService } from './infrastructure/messaging/kafka-producer.service';
import { KafkaRaceProducerService } from './infrastructure/messaging/kafka-race-producer.service';
import { KafkaRealmProducerService } from './infrastructure/messaging/kafka-realm-producer.service';
import { RaceModel, RaceSchema } from './infrastructure/persistence/models/race-model';
import { RealmModel, RealmSchema } from './infrastructure/persistence/models/realm-model';
import { InMemoryArmorTypeRepository } from './infrastructure/persistence/repositories/in-memory-armor-type.repository';
import { InMemoryCharacterSizeRepository } from './infrastructure/persistence/repositories/in-memory-character-size.repository';
import { InMemorySkillCategoryRepository } from './infrastructure/persistence/repositories/in-memory-skill-category.repository';
import { InMemorySkillRepository } from './infrastructure/persistence/repositories/in-memory-skill.repository';
import { MongoRaceRepository } from './infrastructure/persistence/repositories/mongo-race.repository';
import { MongoRealmRepository } from './infrastructure/persistence/repositories/mongo-realm.repository';
import { ArmorTypeController } from './infrastructure/controllers/armor-type.controller copy';
import { SkillCategoryController } from './infrastructure/controllers/skill-categories.controller';
import { SkillController } from './infrastructure/controllers/skill.controller';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: RealmModel.name, schema: RealmSchema },
      { name: RaceModel.name, schema: RaceSchema },
    ]),
    AuthModule,
  ],
  controllers: [RealmController, RaceController, ArmorTypeController, CharacterSizeController, SkillCategoryController, SkillController],
  providers: [
    KafkaProducerService,
    CreateRealmUseCase,
    UpdateRealmUseCase,
    DeleteRealmUseCase,
    CreateRaceUseCase,
    UpdateRaceUseCase,
    DeleteRaceUseCase,
    {
      provide: 'RaceRepository',
      useClass: MongoRaceRepository,
    },
    {
      provide: 'RealmRepository',
      useClass: MongoRealmRepository,
    },
    {
      provide: 'RaceEventProducer',
      useClass: KafkaRaceProducerService,
    },
    {
      provide: 'ArmorTypeRepository',
      useClass: InMemoryArmorTypeRepository,
    },
    {
      provide: 'CharacterSizeRepository',
      useClass: InMemoryCharacterSizeRepository,
    },
    {
      provide: 'SkillCategoryRepository',
      useClass: InMemorySkillCategoryRepository,
    },
    {
      provide: 'SkillRepository',
      useClass: InMemorySkillRepository,
    },
    {
      provide: 'RealmEventProducer',
      useClass: KafkaRealmProducerService,
    },
  ],
})
export class CoreModule {}
