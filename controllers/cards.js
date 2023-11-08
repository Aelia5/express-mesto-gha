const Card = require('../models/card');

const ValidationError = require('../errors/validation-err');
const DefaultError = require('../errors/default-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const {
  validationErrorMessage,
  defaultErrorMessage,
} = require('../utils/constants');

const notFoundMessage = 'Такой карточки не существует';
const forbiddenMessage = 'Вы не можете удалить чужую карточку';

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      let error;
      if (err.name === 'ValidationError') {
        error = new ValidationError(err.message);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('owner')
    .then((cards) => res.send(cards))
    .catch(() => {
      const error = new DefaultError(defaultErrorMessage);
      next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundMessage);
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenMessage);
      } else {
        Card.findByIdAndRemove(card._id)
          .then(() => res.send(card));
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'CastError') {
        error = new ValidationError(validationErrorMessage);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        error = new ValidationError(validationErrorMessage);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};
module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(notFoundMessage);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      let error;
      if (err.statusCode) {
        error = err;
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        error = new ValidationError(validationErrorMessage);
      } else {
        error = new DefaultError(defaultErrorMessage);
      }
      next(error);
    });
};
