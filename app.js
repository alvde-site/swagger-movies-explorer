require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const process = require('process');
const cors = require('cors');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const CentralizedErrorHandler = require('./middlewares/centralized-err-handler');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const {
  createUser,
  login,
  signout,
} = require('./controllers/users');
const { validateCreateUser, validateLogin, validateSignout } = require('./middlewares/validations');
const auth = require('./middlewares/auth');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateCreateUser, createUser);

app.post('/signin', validateLogin, login);

// авторизация
app.use(auth);

app.use('/users', usersRouter);

app.use('/movies', moviesRouter);

app.post('/signout', validateSignout, signout);

app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Извините, я не могу это найти!');
});

app.use(errors()); // обработчик ошибок celebrate

app.use(CentralizedErrorHandler);

app.listen(PORT);
