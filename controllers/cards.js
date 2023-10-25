const Card = require('../models/card');

function sendValidationError(res) {
  res.status(400).send({ message: 'Отправлены некорректные данные' });
}

function sendNotFoundError(res) {
  res.status(404).send({ message: 'Такой карточки не существует' });
}

function sendDefaultError(res) {
  res.status(500).send({ message: 'Произошла ошибка' });
}

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        sendValidationError(res);
      } else {
        sendDefaultError(res);
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({}).populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => sendDefaultError(res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        sendNotFoundError(res);
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => sendDefaultError(res));
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        sendNotFoundError(res);
      } else {
        res.send({ data: card });
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

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        sendNotFoundError(res);
      } else {
        res.send({ data: card });
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
