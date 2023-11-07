const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальное число символов: 2'],
    maxlength: [30, 'Максимальное число символов: 30'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/[a-z0-9а-яё\-]{2,20}\.[a-zа-яё]{2,5}[a-z0-9\-\._~:\/\?#\[\]@!$&*\+,;=]{0,1000}/i.test(v),
      message: 'Введена некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
