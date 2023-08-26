/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const crypto = require('crypto');
const cors = require('cors');
const routes = require('./routes');
const errorsHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

 // eslint-disable-line
const NotFoundError = require('./errors/NotFoundError');
 // eslint-disable-line
const INTERNAL_SERVER_ERROR = 500;

// const URL = 'mongodb://127.0.0.1:27017/filmsdb';
const { NODE_ENV, PORT = 3000, DB_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://0.0.0.0:27017/filmsdb');

const app = express();
app.use(cors({ origin: ['http://localhost:3001', 'https://http://diplom.yaks.nomoredomainsicu.ru'] }));

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on ${PORT}`);
});
