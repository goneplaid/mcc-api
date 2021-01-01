const express = require('express');
const router = express.Router();
const seasonModel = require('../models/season');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.database.connectionString, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('*** we landed on the moon! ***');
});

router.get('/seasons', function (req, res, next) {
  seasonModel.find();

  console.log('oh yeah!')

  res.send('Oh, how nice.');
});

module.exports = router;


/*
var UserSerializer = new JSONAPISerializer('users', {
  attributes: ['firstName', 'lastName']
});

var users = UserSerializer.serialize(data);
*/