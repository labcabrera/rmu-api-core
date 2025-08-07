import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { DomainExceptionFilter } from 'src/modules/core/infrastructure/controllers/domain-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const openApiConfig = new DocumentBuilder().setTitle('Core API').setDescription('Rolemaster Unified Core API.').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api-docs', app, document);

  const clientId = app.get(ConfigService).get<string>('RMU_KAFKA_CLIENT_ID')!;
  const brokers = app.get(ConfigService).get<string>('RMU_KAFKA_BROKERS')!.split(',');
  const consumerGroupId = app.get(ConfigService).get<string>('RMU_KAFKA_CONSUMER_GROUP_ID')!;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: clientId,
        brokers: brokers,
      },
      consumer: {
        groupId: consumerGroupId,
      },
    },
  });

  app.useGlobalFilters(new DomainExceptionFilter());
  await app.listen(app.get(ConfigService).get<string>('PORT') || 3001);
  await app.startAllMicroservices();
}
bootstrap();
