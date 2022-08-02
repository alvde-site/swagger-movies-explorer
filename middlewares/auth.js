const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { SecretKey, AuthError, IncorrectLoginPassword } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError(AuthError);
  }
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SecretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(IncorrectLoginPassword);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
