import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/shared/infrastructure/security/auth.module.js';
import { ProfessionsModule } from './modules/professions/professions.module.js';
import { RacesModule } from './modules/races/races.module.js';
import { RealmsModule } from './modules/realms/realms.module.js';
import { ManeuversModule } from './modules/maneuvers/maneuvers.module.js';
import { TraitsModule } from './modules/traits/traits.module.js';
import { envSchema } from './config/env.schema.js';
import { SharedModule } from './modules/shared/shared.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';
import { SkillCategoriesModule } from './modules/skill-categories/skill-categories.module.js';
import { EnumerationsModule } from './modules/enumerations/enumerations.module.js';
import { CharacterSizesModule } from './modules/character-sizes/character-sizes.module.js';
import { ArmorTypesModule } from './modules/armor-types/armor-types.module.js';
import { ResistanceRollsModule } from './modules/resistance-rolls/resistance-rolls.module.js';
import { CulturesModule } from './modules/cultures/cultures.module.js';
import { EffectTypesModule } from './modules/effect-types/effect-types.module.js';
import { ManeuverModifiersModule } from './modules/maneuver-modifiers/maneuver-modifiers.module.js';
import { HealingTablesModule } from './modules/healing-tables/healing-tables.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envSchema,
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
    EffectTypesModule,
    ResistanceRollsModule,
    CulturesModule,
    ManeuverModifiersModule,
    HealingTablesModule,
  ],
})
export class AppModule {}
