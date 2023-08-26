const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');
const { createUserInfo, login } = require('../controllers/users');

const {
  validateSignIn,
  validateSignUp,
} = require('../middlewares/validation');

router.post('/signin', validateSignIn, login);
router.post('/signup', validateSignUp, createUserInfo);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);

router.all('*', () => {
  throw new NotFoundError('Такой страницы не существует');
});

module.exports = router;
