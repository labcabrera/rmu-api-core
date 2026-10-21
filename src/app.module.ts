import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/shared/infrastructure/security/auth.module';
import { ProfessionsModule } from './modules/professions/professions.module';
import { RacesModule } from './modules/races/races.module';
import { RealmsModule } from './modules/realms/realms.module';
import { ManeuversModule } from './modules/maneuvers/maneuvers.module';
import { TraitsModule } from './modules/traits/traits.module';
import { envSchema } from './config/env.schema';
import { SharedModule } from './modules/shared/shared.module';
import { SkillsModule } from './modules/skills/skills.module';
import { SkillCategoriesModule } from './modules/skill-categories/skill-categories.module';
import { EnumerationsModule } from './modules/enumerations/enumerations.module';
import { CharacterSizesModule } from './modules/character-sizes/character-sizes.module';
import { ArmorTypesModule } from './modules/armor-types/armor-types.module';
import { ResistanceRollsModule } from './modules/resistance-rolls/resistance-rolls.module';
import { CulturesModule } from './modules/cultures/cultures.module';
import { EffectTypesModule } from './modules/effect-types/effect-types.module';
import { ManeuverModifiersModule } from './modules/maneuver-modifiers/maneuver-modifiers.module';
import { HealingTablesModule } from './modules/healing-tables/healing-tables.module';

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
