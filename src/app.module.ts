import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfessionsModule } from './modules/professions/professions.module';
import { RacesModule } from './modules/races/races.module';
import { RealmsModule } from './modules/realms/realms.module';
import { ManeuversModule } from './modules/maneuvers/maneuvers.module';
import { TraitsModule } from './modules/traits/traits.module';
import Joi from 'joi';
import { SharedModule } from './modules/shared/shared.module';
import { SkillsModule } from './modules/skills/skills.module';
import { SkillCategoriesModule } from './modules/skill-categories/skill-categories.module';
import { EnumerationsModule } from './modules/enumerations/enumerations.module';
import { CharacterSizesModule } from './modules/character-sizes/character-sizes.module';
import { ArmorTypesModule } from './modules/armor-types/amor-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().positive().default(3001),
        RMU_MONGO_CORE_URI: Joi.string().required(),
        RMU_IAM_JWK_URI: Joi.string().uri().required(),
        RMU_IAM_TOKEN_URI: Joi.string().uri().required(),
        RMU_IAM_CLIENT_ID: Joi.string().required(),
        RMU_IAM_CLIENT_SECRET: Joi.string().required(),
        RMU_KAFKA_BROKERS: Joi.string().required(),
        RMU_KAFKA_CLIENT_ID: Joi.string().required(),
        RMU_KAFKA_DEFAULT_PARTITIONS: Joi.number().integer().min(1).default(1),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('RMU_MONGO_CORE_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
    CharacterSizesModule,
    ArmorTypesModule,
    SkillCategoriesModule,
    SkillsModule,
    ProfessionsModule,
    RacesModule,
    RealmsModule,
    ManeuversModule,
    TraitsModule,
    EnumerationsModule,
  ],
})
export class AppModule {}
