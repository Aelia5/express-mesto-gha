const User = require('../models/user');

function sendValidationError(res) {
  const ERROR_CODE = 400;
  res.status(ERROR_CODE).send({ message: 'Отправлены некорректные данные' });
}

function sendNotFoundError(res) {
  const ERROR_CODE = 404;
  res.status(ERROR_CODE).send({ message: 'Такого пользователя не существует' });
}

function sendDefaultError(res) {
  const ERROR_CODE = 500;
  res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
}

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
        sendNotFoundError(res);
      } else {
        res.send(user);
      }
    })
    .catch(() => sendDefaultError(res));
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        sendNotFoundError(res);
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
        sendNotFoundError(res);
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
