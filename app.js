require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const process = require('process');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const {
  createUser,
  login,
  signout,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://alvde-mesto.nomoredomains.sbs',
    'https://alvde-mesto.nomoredomains.sbs',
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    // name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
app.use(auth);

app.use('/users', usersRouter);

app.use('/movies', moviesRouter);

app.post('/signout', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signout);

app.use(errorLogger);

app.use(() => {
  throw new NotFoundError('Извините, я не могу это найти!');
});

app.use(errors()); // обработчик ошибок celebrate

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT);
