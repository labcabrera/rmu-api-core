import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LanguageController } from './interfaces/http/language.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateLanguageHandler } from './application/cqrs/handlers/create-language.handler';
import { DeleteLanguageHandler } from './application/cqrs/handlers/delete-language.handler';
import { GetLanguageHandler } from './application/cqrs/handlers/get-language.handler';
import { GetLanguagesHandler } from './application/cqrs/handlers/get-languages.handler';
import { UpdateLanguageHandler } from './application/cqrs/handlers/update-language.handler';
import { MongoLanguageRepository } from './infrastructure/db/mongo.language.repository';
import { KafkaLanguageProducerService } from './infrastructure/messaging/kafka.language-bus.adapter';
import { LanguageModel, LanguageSchema } from './infrastructure/persistence/models/language-model';
import { RealmsModule } from '../realms/realms.module';
import { SharedModule } from '../shared/shared.module';
import { LanguageGuardAdapter } from './infrastructure/security/language-guard.adapter';

@Module({
  imports: [
    TerminusModule,
    CqrsModule,
    MongooseModule.forFeature([{ name: LanguageModel.name, schema: LanguageSchema }]),
    AuthModule,
    SharedModule,
    RealmsModule,
  ],
  controllers: [LanguageController],
  providers: [
    GetLanguageHandler,
    GetLanguagesHandler,
    CreateLanguageHandler,
    UpdateLanguageHandler,
    DeleteLanguageHandler,
    {
      provide: 'LanguageRepository',
      useClass: MongoLanguageRepository,
    },
    {
      provide: 'LanguageEventProducer',
      useClass: KafkaLanguageProducerService,
    },
    {
      provide: 'LanguageGuardPort',
      useClass: LanguageGuardAdapter,
    },
  ],
  exports: ['LanguageRepository'],
})
export class LanguagesModule {}
