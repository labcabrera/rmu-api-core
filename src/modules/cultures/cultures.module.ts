import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../auth/auth.module';
import { KafkaCultureEventBusAdapter } from './infrastructure/messaging/kafka.culture-event-bus.adapter';
import { RealmsModule } from '../realms/realms.module';
import { SharedModule } from '../shared/shared.module';
import { CultureModel, CultureSchema } from './infrastructure/persistence/models/culture-model';
import { CultureController } from './interfaces/http/culture.controller';
import { CultureGuardAdapter } from './infrastructure/security/culture-guard.adapter';
import { GetCultureHandler } from './application/cqrs/handlers/get-culture.query.handler';
import { GetCulturesHandler } from './application/cqrs/handlers/get-cultures.query.handler';
import { CreateCultureHandler } from './application/cqrs/handlers/create-culture.handler';
import { UpdateCultureHandler } from './application/cqrs/handlers/update-race.handler';
import { DeleteCultureHandler } from './application/cqrs/handlers/delete-culture.handler';
import { MongoCultureRepository } from './infrastructure/db/mongo.culture.repository';
import { AddCultureFixedSkillRankHandler } from './application/cqrs/handlers/add-culture-fixed-skill-rank.handler';
import { DeleteCultureFixedSkillRankHandler } from './application/cqrs/handlers/delete-culture-fixed-skill-rank.handler';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: CultureModel.name, schema: CultureSchema }]),
    AuthModule,
    SharedModule,
    RealmsModule,
  ],
  controllers: [CultureController],
  providers: [
    GetCultureHandler,
    GetCulturesHandler,
    CreateCultureHandler,
    UpdateCultureHandler,
    DeleteCultureHandler,
    AddCultureFixedSkillRankHandler,
    DeleteCultureFixedSkillRankHandler,
    {
      provide: 'CultureRepository',
      useClass: MongoCultureRepository,
    },
    {
      provide: 'CultureEventProducer',
      useClass: KafkaCultureEventBusAdapter,
    },
    {
      provide: 'CultureGuard',
      useClass: CultureGuardAdapter,
    },
  ],
  exports: ['CultureRepository'],
})
export class CulturesModule {}
