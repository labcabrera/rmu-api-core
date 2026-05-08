import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KafkaTraitProducerService } from './infrastructure/messaging/kafka.trait-event-bus.adapter';
import { MongoTraitRepository } from './infrastructure/db/mongo.trait.repository';
import { TraitController } from './interfaces/http/trait.controller';
import { CreateTraitHandler } from './application/cqrs/handlers/create-trait.handler';
import { DeleteTraitHandler } from './application/cqrs/handlers/delete-trait.handler';
import { GetTraitsHandler } from './application/cqrs/handlers/get-realms.handler';
import { GetTraitHandler } from './application/cqrs/handlers/get-trait.handler';
import { UpdateTraitHandler } from './application/cqrs/handlers/update-trait.handler';
import { TraitModel, TraitSchema } from './infrastructure/persistence/models/trait-model';
import { SharedModule } from '../shared/shared.module';
import { TraitGuardAdapter } from './infrastructure/security/trait-guard.adapter';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: TraitModel.name, schema: TraitSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [TraitController],
  providers: [
    GetTraitHandler,
    GetTraitsHandler,
    CreateTraitHandler,
    UpdateTraitHandler,
    DeleteTraitHandler,
    {
      provide: 'TraitRepository',
      useClass: MongoTraitRepository,
    },
    {
      provide: 'TraitEventProducer',
      useClass: KafkaTraitProducerService,
    },
    {
      provide: 'TraitGuardPort',
      useClass: TraitGuardAdapter,
    },
  ],
  exports: ['TraitRepository'],
})
export class TraitsModule {}
