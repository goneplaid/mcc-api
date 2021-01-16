const express = require('express');
const router = express.Router();
const model = require('../models/season');
const serializer = require('../serializers/season');

require('../lib/connect-db')();

router.get('/seasons', async (req, res, next) => {
  const cursor = model.find({}).cursor();
  const toSerialize = [];

  for (let document = await cursor.next(); document != null; document = await cursor.next()) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

module.exports = router;
