const VALIDATION_ERROR_CODE = 400;
const UNAUTHORIZED_ERROR_CODE = 401;
const FORBIDDEN_ERROR_CODE = 403;
const NOT_FOUND_ERROR_CODE = 404;
const CONFLICT_ERROR_CODE = 409;
const DEFAULT_ERROR_CODE = 500;

const conflictMessage = 'Такой пользователь уже существует';
const validationErrorMessage = 'Отправлены некорректные данные';
const defaultErrorMessage = 'На сервере произошла ошибка';

module.exports = {
  VALIDATION_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  conflictMessage,
  validationErrorMessage,
  defaultErrorMessage,
};
