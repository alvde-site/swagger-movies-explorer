const usersRouter = require('express').Router();

const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

usersRouter.get('/me', getCurrentUser);

usersRouter.patch('/me', validationUpdateUser, updateUser);

module.exports = usersRouter;
