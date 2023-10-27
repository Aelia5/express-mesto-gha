const User = require('../models/user');

const { sendValidationError, sendNotFoundError, sendDefaultError } = require('../utils/utils');

const notFoundMessage = 'Такого пользователя не существует';

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        sendValidationError(res);
      } else {
        sendDefaultError(res);
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => sendDefaultError(res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        sendNotFoundError(res, notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        sendValidationError(res);
      } else {
        sendDefaultError(res);
      }
    });
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        sendNotFoundError(res, notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        sendValidationError(res);
      } else {
        sendDefaultError(res);
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        sendNotFoundError(res, notFoundMessage);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        sendValidationError(res);
      } else {
        sendDefaultError(res);
      }
    });
};
