import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from '../core/core.module';
import { KafkaTraitProducerService } from './infrastructure/messaging/kafka.trait-bus.adapter';
import { MongoTraitRepository } from './infrastructure/db/mongo.trait.repository';
import { TraitController } from './interfaces/http/trait.controller';
import { CreateTraitHandler } from './application/cqrs/handlers/create-trait.handler';
import { DeleteTraitHandler } from './application/cqrs/handlers/delete-trait.handler';
import { GetTraitsHandler } from './application/cqrs/handlers/get-realms.handler';
import { GetTraitHandler } from './application/cqrs/handlers/get-trait.handler';
import { UpdateTraitHandler } from './application/cqrs/handlers/update-trait.handler';
import { TraitModel, TraitSchema } from './infrastructure/persistence/models/trait-model';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: TraitModel.name, schema: TraitSchema }]),
    AuthModule,
    CoreModule,
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
  ],
  exports: ['TraitRepository'],
})
export class TraitsModule {}
