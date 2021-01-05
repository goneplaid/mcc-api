const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');

// IMPORT ROUTES

const seasons = require('./app/routes/seasons');

// DB & MONGOOSE

mongoose.connect(config.database.connectionString, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('*** we landed on the moon! ***');
});

const app = express();

// APP SETUP

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: set up some reusable URI helpers
app.use(cors({ origin: 'http://localhost:7000' }));

// ROUTES

//app.get('/', seasons.list);
//app.get('/seasons/:number', seasons.view);


app.use(seasons);




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
});

module.exports = app;
