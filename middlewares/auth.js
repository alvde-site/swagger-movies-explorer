const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const { SecretKey, AuthError, IncorrectLoginPassword } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // убеждаемся, что  authorization есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: AuthError });
  }

  // извлечём токен
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SecretKey);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError(IncorrectLoginPassword);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
