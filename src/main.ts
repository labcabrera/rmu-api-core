import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module.js';
import { configureLogger } from './bootstrap/logger.js';
import { configureOpenApi } from './bootstrap/openapi.js';
import { HttpExceptionFilter } from './modules/shared/interfaces/http/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: configureLogger(process.env.LOG_LEVEL) });
  const config = app.get(ConfigService);
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  configureOpenApi(app);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { clientId: config.get<string>('RMU_KAFKA_CLIENT_ID'), brokers: config.get<string>('RMU_KAFKA_BROKERS')!.split(',') },
      // Without it Nest falls back to a group shared with every API that also leaves it unset.
      consumer: { groupId: config.get<string>('RMU_KAFKA_CONSUMER_GROUP_ID')! },
    },
  });
  await app.listen(config.get<number>('PORT')!);
  await app.startAllMicroservices();
}

void bootstrap();
