import { injectable, inject } from 'inversify';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { DomainEvent } from '@domain/events/domain-event';
import { EventNotificationPort } from '@domain/ports/outbound/event-notification.port';
import { Configuration } from '@shared/configuration';

@injectable()
export class KafkaEventNotificationAdapter implements EventNotificationPort {
  private readonly kafka: Kafka;
  private producer: Producer | null = null;
  private readonly topicPrefix = 'rmu-core';
  private isInitialized = false;

  constructor(@inject('Configuration') private config: Configuration) {
    // Configurar Kafka con configuración desde el archivo de configuración
    this.kafka = new Kafka({
      clientId: 'rmu-api-core',
      brokers: this.getBrokers(),
      retry: {
        initialRetryTime: 100,
        retries: 3
      }
    });

    console.log('🚀 Kafka Event Notification Adapter initialized');
  }

  private getBrokers(): string[] {
    // Por defecto usar localhost, pero permitir configuración desde variables de entorno
    const brokers = process.env.KAFKA_BROKERS || 'localhost:9092';
    return brokers.split(',').map(broker => broker.trim());
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('🔌 Initializing Kafka producer...');
      this.producer = this.kafka.producer({
        maxInFlightRequests: 1,
        idempotent: true,
        transactionTimeout: 30000
      });

      await this.producer.connect();
      console.log('✅ Kafka producer connected successfully');
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Kafka producer:', error);
      throw error;
    }
  }

  async notify(event: DomainEvent): Promise<void> {
    try {
      await this.initialize();
      
      if (!this.producer) {
        throw new Error('Kafka producer not initialized');
      }

      const topic = this.getTopicName(event.eventType);
      const message = this.createMessage(event);
      
      const producerRecord: ProducerRecord = {
        topic,
        messages: [
          {
            partition: this.getPartition(event.aggregateId),
            key: event.aggregateId,
            value: JSON.stringify(message),
            timestamp: event.occurredOn.getTime().toString(),
            headers: {
              eventType: event.eventType,
              eventVersion: event.eventVersion.toString(),
              contentType: 'application/json'
            }
          }
        ]
      };

      console.log(`📤 Sending event to Kafka topic "${topic}"`);
      const result = await this.producer.send(producerRecord);
      
      console.log(`✅ Event sent to Kafka successfully:`, {
        topic,
        partition: result[0].partition,
        offset: result[0].offset,
        eventType: event.eventType,
        aggregateId: event.aggregateId
      });
      
    } catch (error) {
      console.error('❌ Failed to send event to Kafka:', error);
      throw error;
    }
  }

  async notifyBatch(events: DomainEvent[]): Promise<void> {
    try {
      await this.initialize();
      
      if (!this.producer) {
        throw new Error('Kafka producer not initialized');
      }

      // Agrupar eventos por topic para envío eficiente
      const eventsByTopic = new Map<string, DomainEvent[]>();
      
      events.forEach(event => {
        const topic = this.getTopicName(event.eventType);
        if (!eventsByTopic.has(topic)) {
          eventsByTopic.set(topic, []);
        }
        eventsByTopic.get(topic)!.push(event);
      });

      console.log(`📤 Sending ${events.length} events to ${eventsByTopic.size} Kafka topics`);
      
      // Enviar eventos por topic
      const sendPromises = Array.from(eventsByTopic.entries()).map(async ([topic, topicEvents]) => {
        const messages = topicEvents.map(event => ({
          partition: this.getPartition(event.aggregateId),
          key: event.aggregateId,
          value: JSON.stringify(this.createMessage(event)),
          timestamp: event.occurredOn.getTime().toString(),
          headers: {
            eventType: event.eventType,
            eventVersion: event.eventVersion.toString(),
            contentType: 'application/json'
          }
        }));

        const producerRecord: ProducerRecord = {
          topic,
          messages
        };

        return this.producer!.send(producerRecord);
      });

      const results = await Promise.all(sendPromises);
      
      let totalSent = 0;
      results.forEach((topicResults, index) => {
        const topic = Array.from(eventsByTopic.keys())[index];
        totalSent += topicResults.length;
        console.log(`✅ Sent ${topicResults.length} events to topic "${topic}"`);
      });
      
      console.log(`✅ All ${totalSent} events sent to Kafka successfully`);
      
    } catch (error) {
      console.error('❌ Failed to send batch events to Kafka:', error);
      throw error;
    }
  }

  private getTopicName(eventType: string): string {
    // Convertir PascalCase a kebab-case para nombres de topics
    const kebabCase = eventType
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    
    return `${this.topicPrefix}.${kebabCase}`;
  }

  private getPartition(aggregateId: string): number {
    // Usar hash simple del aggregateId para determinar partición
    // Esto asegura que eventos del mismo agregado vayan a la misma partición
    let hash = 0;
    for (let i = 0; i < aggregateId.length; i++) {
      const char = aggregateId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    
    // Limitar a 3 particiones por defecto (configurable)
    const partitionCount = parseInt(process.env.KAFKA_PARTITION_COUNT || '3');
    return Math.abs(hash) % partitionCount;
  }

  private createMessage(event: DomainEvent): object {
    return {
      id: `${event.aggregateId}-${event.occurredOn.getTime()}`,
      timestamp: event.occurredOn.toISOString(),
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      version: event.eventVersion,
      data: event.toJSON(),
      metadata: {
        source: 'rmu-api-core',
        correlationId: this.generateCorrelationId(),
        causationId: event.aggregateId
      }
    };
  }

  private generateCorrelationId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      try {
        console.log('🔌 Disconnecting Kafka producer...');
        await this.producer.disconnect();
        console.log('✅ Kafka producer disconnected');
        this.isInitialized = false;
        this.producer = null;
      } catch (error) {
        console.error('❌ Error disconnecting Kafka producer:', error);
        throw error;
      }
    }
  }
}
