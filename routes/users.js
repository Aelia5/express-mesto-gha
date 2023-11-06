const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

router.get('/:userId', getUserById);

module.exports = router;
