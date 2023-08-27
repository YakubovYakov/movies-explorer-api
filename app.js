const express = require('express');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes');
const errorsHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');

dotenv.config();

const {
  NODE_ENV,
  PORT = 3000,
  DB_URL,
} = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://0.0.0.0:27017/filmsdb');

const app = express();
app.use(cors({ origin: ['http://localhost:3001', 'https://http://diplom.yaks.nomoredomainsicu.ru'] }));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT);
