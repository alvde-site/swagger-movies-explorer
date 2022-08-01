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
const { options, ServerCrash } = require('./utils/constants');

const routes = require('./routes');
const { MoviesDB } = require('./config');

const { PORT = 3001 } = process.env;

const app = express();

app.use('*', cors(options)); // Подключаем первой миддлварой
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(MoviesDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ServerCrash);
  }, 0);
});

app.use(routes);

app.use(NotFoundErrorHandler);

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use(CentralizedErrorHandler);

app.listen(PORT);
