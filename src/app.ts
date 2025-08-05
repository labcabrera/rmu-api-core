import 'module-alias/register';
import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import path from 'path';
import { raceRouter } from '@infrastructure/adapters/inbound/web/routes/race.routes';
import { realmRouter } from '@infrastructure/adapters/inbound/web/routes/realm.routes';
import { skillRouter } from '@infrastructure/adapters/inbound/web/routes/skill.routes';
import { skillCategoryRouter } from '@infrastructure/adapters/inbound/web/routes/skill-category.routes';
import { characterSizeRouter } from '@infrastructure/adapters/inbound/web/routes/character-size.routes';
import { armorTypeRouter } from '@infrastructure/adapters/inbound/web/routes/armor-type.routes';
import { healthRouter } from '@infrastructure/adapters/inbound/web/routes/health.routes';
import { errorHandler } from '@infrastructure/adapters/inbound/web/error-handler';
import { config } from '@infrastructure/config/config';
import { container } from '@shared/container';
import { Logger } from '@application/ports/logger';

const logger: Logger = container.get('Logger');

const app = express();

const openapiFilePath = path.join(__dirname, '../openapi.yaml');
const openapiFile = fs.readFileSync(openapiFilePath, 'utf8');
const swaggerDocument = YAML.parse(openapiFile);

app.use(express.json());
app.use(cors());

mongoose
  .connect(config.mongoUri)
  .then(() => logger.info(`Connected to ${config.mongoUri}`))
  .catch(err => logger.error(`Error connecting to ${config.mongoUri}`, err));

app.use('/v1/races', raceRouter);
app.use('/v1/realms', realmRouter);
app.use('/v1/skills', skillRouter);
app.use('/v1/skill-categories', skillCategoryRouter);
app.use('/v1/character-sizes', characterSizeRouter);
app.use('/v1/armor-types', armorTypeRouter);
app.use('/v1/health', healthRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`API started on ${config.port}`);
});

export default app;
