const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');
const DefaultError = require('../errors/default-err');

const {
  defaultErrorMessage,
} = require('../utils/constants');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  let payload;
  try {
    payload = jwt.verify(token, '075b1f9d4795eb0cda96f34e1bd1d072fb1d86ad38e54bea0dfb5a041ddec676');
  } catch (err) {
    let error;
    if (err.statusCode) {
      error = err;
    } else {
      error = new DefaultError(defaultErrorMessage);
    }
    next(error);
  }
  req.user = payload;
  next();
};
