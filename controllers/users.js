const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному_id в БД не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден'));
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
        next(new BadRequestError('При обновлении профиля произошла ошибка'));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('При обновлении профиля произошла ошибка'));
      } else {
        next(err);
      }
    });
};
