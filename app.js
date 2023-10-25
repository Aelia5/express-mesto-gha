const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65362a5602d13a1c7767a694',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req, res) => {
  const ERROR_CODE = 404;
  res.status(ERROR_CODE).send({ message: 'Такой путь не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
