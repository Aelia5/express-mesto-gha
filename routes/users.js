const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', celebrate({
  body: Joi.object().keys({
    user: Joi.string().alphanum().length(24),
  }),
}), getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    user: Joi.string().alphanum().length(24),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    user: Joi.string().alphanum().length(24),
    avatar: Joi.string().required().regex(/https?:\/\/[a-z0-9\-._~:/?#[\]@!$&*+,;=]{4,1000}/i),
  }),
}), updateAvatar);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

module.exports = router;
