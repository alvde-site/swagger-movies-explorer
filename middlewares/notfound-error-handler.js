const NotFoundError = require('../errors/not-found-err');

module.exports = () => {
  throw new NotFoundError('Извините, я не могу это найти!');
};
