require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const process = require('process');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./utils/rateLimit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const CentralizedErrorHandler = require('./middlewares/centralized-err-handler');
const NotFoundErrorHandler = require('./middlewares/notfound-error-handler');

const routes = require('./routes');
const { MoviesDB } = require('./utils/constants');

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://alvdediploma.nomoredomains.xyz',
    'https://alvdediploma.nomoredomains.xyz',
    'https://alvde-site.github.io',
  ],
  credentials: true, // эта опция позволяет устанавливать куки
};

app.use('*', cors(options)); // Подключаем первой миддлварой
app.use(helmet());
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MoviesDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(NotFoundErrorHandler);

app.use(errors()); // обработчик ошибок celebrate

app.use(CentralizedErrorHandler);

app.listen(PORT);
