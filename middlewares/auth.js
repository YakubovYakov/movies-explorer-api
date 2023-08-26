const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMsg = 'Ошибка авторизации';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized(`${errorMsg}(${authorization})!`));
  }
  const token = authorization.replace(bearer, '');
  let payloud;

  try {
    payloud = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new Unauthorized(`${errorMsg}`));
  }
  req.user = payloud;

  return next();
};
