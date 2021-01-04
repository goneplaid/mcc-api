const express = require('express');
const router = express.Router();
const {
  model,
  serializer
} = require('../models/season');
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.database.connectionString, { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('*** we landed on the moon! ***');
});

router.get('/seasons', async (req, res, next) => {
  await model.find({});

  const seasons = serializer.serialize(model);

  res.send(seasons);
});

module.exports = router;
