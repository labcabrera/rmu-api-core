import 'module-alias/register';
import 'reflect-metadata';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import path from 'path';
import { raceRouter } from '@infrastructure/adapters/routes/raceRoutes';
import { realmRouter } from '@infrastructure/adapters/routes/realmRoutes';
import { skillRouter } from '@infrastructure/adapters/routes/skillRoutes';
import { skillCategoryRouter } from '@infrastructure/adapters/routes/skillCategoryRoutes';
import { characterSizeRouter } from '@infrastructure/adapters/routes/characterSizeRoutes';
import { armorTypeRouter } from '@infrastructure/adapters/routes/armorTypeRoutes';
import { errorHandler } from '@infrastructure/adapters/middleware/errorHandler';

function maskStdUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.username) u.username = '***';
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return url;
  }
}

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.RMU_MONGO_CORE_URI || 'mongodb://admin:admin@localhost:27017/rmu-core?authSource=admin';

const openapiFilePath = path.join(__dirname, '../openapi.yaml');
const openapiFile = fs.readFileSync(openapiFilePath, 'utf8');
const swaggerDocument = YAML.parse(openapiFile);

app.use(express.json());
app.use(cors());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to ' + maskStdUrl(MONGO_URI)))
  .catch(err => console.log('Error connecting to ' + maskStdUrl(MONGO_URI), err));

app.use('/v1/races', raceRouter);
app.use('/v1/realms', realmRouter);
app.use('/v1/skills', skillRouter);
app.use('/v1/skill-categories', skillCategoryRouter);
app.use('/v1/character-sizes', characterSizeRouter);
app.use('/v1/armor-types', armorTypeRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API started on ${PORT}`);
});



export default app;
