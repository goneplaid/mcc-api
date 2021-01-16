const express = require('express');
const router = express.Router();
const model = require('../models/season');
const serializer = require('../serializers/season');

router.get('/seasons', async (req, res, next) => {
  const toSerialize = [];

  for await (const document of model.find({})) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

router.get('/seasons/{id}', async (req, res, next) => {
  const toSerialize = [];

  for await (const document of model.find({})) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

module.exports = router;
