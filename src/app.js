const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rmu-core';

const openapiFilePath = path.join(__dirname, '../openapi.yaml');
const openapiFile = fs.readFileSync(openapiFilePath, 'utf8')
const swaggerDocument = YAML.parse(openapiFile);

app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to ' + MONGO_URI))
  .catch((err) => console.log('Error connecting to ' + MONGO_URI, err));

const realmRouter = require('./routes/realm-controller');
const raceRouter = require('./routes/race-controller');
const armorTypeRouter = require('./routes/armor-type-controller');
const characterSizeRouter = require('./routes/character-size-controller');
const skillCategoryRouter = require('./routes/skill-category-controller');
const skillRouter = require('./routes/skill-controller');

app.use('/v1/realms', realmRouter);
app.use('/v1/races', raceRouter);
app.use('/v1/armor-types', armorTypeRouter);
app.use('/v1/character-sizes', characterSizeRouter);
app.use('/v1/skill-categories', skillCategoryRouter);
app.use('/v1/skills', skillRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

app.listen(PORT, () => {
  console.log(`API started on ${PORT}`);
});