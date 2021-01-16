const express = require('express');
const router = express.Router();
const {
  model,
  serializer
} = require('../models/season');
const connectDb = require('../middleware/connect-db');

connectDb();

router.get('/seasons', async (req, res, next) => {
  const cursor = model.find({}).cursor();
  const toSerialize = [];

  for (let document = await cursor.next(); document != null; document = await cursor.next()) {
    toSerialize.push(document);
  }

  debugger;

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

module.exports = router;
