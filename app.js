const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  const error = new NotFoundError('Такой путь не существует');
  next(error);
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
