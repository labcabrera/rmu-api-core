import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './infrastructure/security/auth.module.js';
import { KafkaProducerService } from './infrastructure/messaging/kafka-producer.service.js';
import { HealthController } from './interfaces/http/health.controller.js';
import { TerminusModule } from '@nestjs/terminus';
import { RsqlParser } from './infrastructure/persistence/repositories/rsql-parser.js';

@Module({
  imports: [TerminusModule, CqrsModule, ConfigModule, AuthModule],
  controllers: [HealthController],
  providers: [RsqlParser, KafkaProducerService],
  exports: [RsqlParser, KafkaProducerService],
})
export class SharedModule {}
