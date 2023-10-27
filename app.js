const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const { sendNotFoundError } = require('./utils/utils');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(helmet());

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65362a5602d13a1c7767a694',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => {
  sendNotFoundError(res, 'Такой путь не существует');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
