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
import { errorHandler } from '@infrastructure/adapters/middleware/errorHandler';

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.RMU_MONGO_CORE_URI || 'mongodb://admin:admin@localhost:27017/rmu-core?authSource=admin';

// Load OpenAPI documentation
const openapiFilePath = path.join(__dirname, '../openapi.yaml');
const openapiFile = fs.readFileSync(openapiFilePath, 'utf8');
const swaggerDocument = YAML.parse(openapiFile);

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to ' + MONGO_URI))
  .catch(err => console.log('Error connecting to ' + MONGO_URI, err));

// Routes
app.use('/v1/races', raceRouter);
app.use('/v1/realms', realmRouter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Default route
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API started on ${PORT}`);
});

export default app;
