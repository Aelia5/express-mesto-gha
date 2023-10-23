const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = require('./routes/users');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '65362a5602d13a1c7767a694',
  };

  next();
});

app.use('/users', router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
