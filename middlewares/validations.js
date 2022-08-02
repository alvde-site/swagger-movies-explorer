const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { IncorrectLinkFormat } = require('../utils/constants');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new Error(IncorrectLinkFormat);
  }
  return value;
};

// Валидация /signup роута

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация /signin роута

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Валидация /moveis роута

const validatePostMoviesRouter = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().integer(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().integer(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validateDeleteMovie = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

// Валидация /users роута

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validatePostMoviesRouter,
  validateDeleteMovie,
  validationUpdateUser,
};
