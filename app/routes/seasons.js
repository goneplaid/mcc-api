const express = require('express');
const router = express.Router();
const seasonModel = require('../models/season');
const judgeModel = require('../models/judge');
const serializer = require('../serializers/season');

router.get('/seasons', async (req, res, next) => {
  const toSerialize = [];

  for await (const document of seasonModel.find().populate('judges')) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

router.get('/seasons/{id}', async (req, res, next) => {
  const toSerialize = [];

  for await (const document of seasonModel.find({})) {
    toSerialize.push(document);
  }

  const seasons = serializer.serialize(toSerialize);

  res.send(seasons);
});

module.exports = router;
