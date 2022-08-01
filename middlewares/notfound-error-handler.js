const NotFoundError = require('../errors/not-found-err');
const { CanNotFind } = require('../utils/constants');

module.exports = () => {
  throw new NotFoundError(CanNotFind);
};
