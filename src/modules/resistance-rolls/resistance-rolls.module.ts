import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SharedModule } from '../shared/shared.module';
import { ResistanceRollService } from './domain/services/resistance-roll.service';
import { ResistanceRollController } from './infrastructure/controllers/resistance-roll.controller';
import { ResistanceRollHandler } from './application/cqrs/handlers/resistance-roll.handler';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ResistanceRollController],
  providers: [ResistanceRollService, ResistanceRollHandler],
})
export class ResistanceRollsModule {}
