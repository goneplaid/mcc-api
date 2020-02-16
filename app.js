const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('node-config');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// APP SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:7000' }));

// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// DATABASE
mongoose.connect('mongodb://gordon:rosemary-awkward-worcestershire1@ds119748.mlab.com:19748/mcc-development', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('we landed on the moon!');
});

const seasonSchema = new mongoose.Schema({
  id: String,
  number: String,
  judge_ids: Array,
  contestant_ids: Array,
  episode_ids: Array
})

const Season = mongoose.model('Season', seasonSchema);

const season2 = Season.findOne({ number: '2' }, function (error, result) {
  console.log(result.id);
});



// END POINTS
app.use('/', indexRouter);
app.use('/users', usersRouter);

// API ERROR HANDLING
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
