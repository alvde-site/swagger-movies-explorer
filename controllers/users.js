const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorized-err');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-error');
const {
  NotFoundUser,
  EditProfileError,
  IncorrectUserData,
  UsedEmail,
  SecretKey,
  IncorrectLoginPassword,
  DeletedToken,
  SomethingWrong,
} = require('../utils/constants');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(NotFoundUser);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(NotFoundUser));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true, runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(EditProfileError));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      name: user.name, email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(IncorrectUserData));
      } else if (err.code === 11000) {
        next(new ConflictError(UsedEmail));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : SecretKey,
        { expiresIn: '7d' },
      );
      // отправим токен, браузер сохранит его в куках
      res.send({ token }); // если у ответа нет тела, можно использовать метод end
    })
    .catch(() => {
      // возвращаем ошибку аутентификации
      throw new UnauthorizedError(IncorrectLoginPassword);
    })
    .catch(next);
};

module.exports.signout = (req, res, next) => {
  Promise.resolve().then(() => {
    res.send({ message: DeletedToken }); // если у ответа нет тела, можно использовать метод end
  })
    .catch(() => {
    // возвращаем ошибку аутентификации
      throw new BadRequestError(SomethingWrong);
    })
    .catch(next);
};
