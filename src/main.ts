import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from 'src/modules/core/infrastructure/controllers/domain-exception-filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const openApiConfig = new DocumentBuilder().setTitle('Core API').setDescription('Rolemaster Unified Core API.').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api-docs', app, document);

  const clientId = app.get(ConfigService).get<string>('RMU_KAFKA_CLIENT_ID')!;
  const brokers = app.get(ConfigService).get<string>('RMU_KAFKA_BROKERS')!.split(',');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: clientId,
        brokers: brokers,
      },
    },
  });

  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(app.get(ConfigService).get<string>('PORT') || 3001);
  await app.startAllMicroservices();
}
bootstrap();
