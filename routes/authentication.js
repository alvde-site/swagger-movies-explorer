const authRouter = require('express').Router();

const {
  createUser,
  login,
} = require('../controllers/users');

const { validateCreateUser, validateLogin } = require('../middlewares/validations');

authRouter.post('/signup', validateCreateUser, createUser);

authRouter.post('/signin', validateLogin, login);

module.exports = authRouter;
