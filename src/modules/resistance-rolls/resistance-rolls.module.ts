import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from '../shared/infrastructure/security/auth.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { ResistanceRollService } from './domain/services/resistance-roll.service.js';
import { ResistanceRollController } from './interfaces/http/resistance-roll.controller.js';
import { ResistanceRollHandler } from './application/cqrs/handlers/resistance-roll.handler.js';

@Module({
  imports: [TerminusModule, CqrsModule, AuthModule, SharedModule],
  controllers: [ResistanceRollController],
  providers: [ResistanceRollService, ResistanceRollHandler],
})
export class ResistanceRollsModule {}
