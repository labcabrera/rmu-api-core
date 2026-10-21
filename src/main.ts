import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { configureLogger } from './bootstrap/logger';
import { configureOpenApi } from './bootstrap/openapi';
import { DomainExceptionFilter } from './modules/shared/interfaces/http/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: configureLogger(process.env.LOG_LEVEL) });
  const config = app.get(ConfigService);
  app.enableCors();
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true }, whitelist: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
  configureOpenApi(app);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { clientId: config.get<string>('RMU_KAFKA_CLIENT_ID'), brokers: config.get<string>('RMU_KAFKA_BROKERS')!.split(',') },
    },
  });
  await app.listen(config.get<number>('PORT')!);
  await app.startAllMicroservices();
}

void bootstrap();
