const { VALIDATION_ERROR_CODE, NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE } = require('./constants');

module.exports.sendValidationError = (res) => {
  res.status(VALIDATION_ERROR_CODE).send({ message: 'Отправлены некорректные данные' });
};

module.exports.sendNotFoundError = (res, messageText) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: messageText });
};

module.exports.sendDefaultError = (res) => {
  res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
};
