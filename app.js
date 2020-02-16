const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('node-config');
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const api = require('json-api');

const app = express();

// APP SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: 'http://localhost:7000' }));

// VIEW ENGINE
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('*** we landed on the moon! ***');
});

// END POINTS

const models = {
  "Season": require('./app/models/season'),
  "Episode": require('./app/models/episode'),
  "Challenge": require('./app/models/challenge'),
  "Contestant": require('./app/models/contestant'),
  "Participant": require('./app/models/participant'),
  "Judge": require('./app/models/judge'),
};

const adapter = new api.dbAdapters.Mongoose(models);
const registry = new api.ResourceTypeRegistry({
  "seasons": {},
  "episodes": {},
  "challenges": {},
  "contestants": {},
  "participants": {},
  "judges": {},
}, {
  "dbAdapter": adapter,
  "urlTemplates": {
    "self": "/{type}/{id}"
  }
});

const opts = { host: 'localhost:3000' };

// Set up a front controller, passing it controllers that'll be used
// to handle requests for API resources and for the auto-generated docs.
var Front = new api.httpStrategies.Express(
  new api.controllers.API(registry),
  new api.controllers.Documentation(registry, { name: 'MCC-API' })
);

app.get("/", Front.docsRequest);

app.get("/:type(seasons)", Front.apiRequest);
app.get("/:type(season|seasons)/:id", Front.apiRequest);

app.get("/:type(episodes)", Front.apiRequest);
app.get("/:type(episode|episodes)/:id", Front.apiRequest);

app.get("/:type(challenges)", Front.apiRequest);
app.get("/:type(challenge|challenges)/:id", Front.apiRequest);

app.get("/:type(contestants)", Front.apiRequest);
app.get("/:type(contestant|contestants)/:id", Front.apiRequest);

app.get("/:type(participants)", Front.apiRequest);
app.get("/:type(participant|participants)/:id", Front.apiRequest);

app.get("/:type(judges)", Front.apiRequest);
app.get("/:type(judge|judges)/:id", Front.apiRequest);

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
