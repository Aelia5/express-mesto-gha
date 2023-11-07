const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const ValidationError = require('../errors/validation-err');
const DefaultError = require('../errors/default-err');
const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const {
  conflictMessage,
  validationErrorMessage,
  defaultErrorMessage,
} = require('../utils/constants');

const notFoundMessage = 'Такой пользователь не существует';
const unauthorizedMessage = 'Неправильные почта или пароль';

module.exports.createUser = (req, res, next) => {
  if (!req.body.password || req.body.password.length < 7) {
    throw new ValidationError('Минимальная длина пароля: 7 символов');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => res.send(user))
        .catch((err) => {
          let error;
          if (err.code === 11000) {
            error = new ConflictError(conflictMessage);
          } else if (err.name === 'ValidationError') {
            error = new ValidationError(err.message);
          } else {
            error = new DefaultError(defaultErrorMessage);
          }
          next(error);
        });
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      const error = new DefaultError(defaultErrorMessage);
      next(error);
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'CastError') {
        error = new ValidationError(err.message);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      const error = new DefaultError(defaultErrorMessage);
      next(error);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        error = new ValidationError(err.message || validationErrorMessage);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'CastError' || err.name === 'ValidationError') {
        error = new ValidationError(err.message || validationErrorMessage);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(unauthorizedMessage);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(unauthorizedMessage);
          }
          return (user);
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, '075b1f9d4795eb0cda96f34e1bd1d072fb1d86ad38e54bea0dfb5a041ddec676', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).end();
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};
