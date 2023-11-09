const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const app = express();
const router = require('./routes/index');
const { handleError } = require('./middlewares/handleError');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(helmet());

app.use(cookieParser());
app.use(bodyParser.json());

app.use(router);

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
