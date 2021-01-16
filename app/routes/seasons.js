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
  /* no-op */
});

router.get('/seasons', async (req, res, next) => {
  const cursor = model.find({}).lean().cursor();
  const toSerialize = [];

  for (let document = await cursor.next(); document != null; document = await cursor.next()) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

module.exports = router;
