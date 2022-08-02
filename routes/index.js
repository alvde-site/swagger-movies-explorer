const router = require('express').Router();
const authRouter = require('./authentication');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { signout } = require('../controllers/users');

router.use('/', authRouter);
router.use('/', auth);
router.use('/signout', signout);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

module.exports = router;
