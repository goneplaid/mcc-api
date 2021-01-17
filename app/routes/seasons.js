const express = require('express');
const router = express.Router();
const seasonModel = require('../models/season');
const judgeModel = require('../models/judge');
const contestantModel = require('../models/contestant');
const episodeModel = require('../models/episode');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// GET seasons

const seasonsSerializer = new JSONAPISerializer('seasons', {
  topLevelLinks: {
    // TODO: set up some reusable URI helpers
    self: 'http://localhost:7000/seasons',
  },
  dataLinks: {
    self: (season) => `http://localhost:7000/seasons/${season.number}`
  },
  attributes: [
    'number',
    'judges',
  ],
  judges: {
    ref: 'id',
    attributes: ['name', 'avatar'],
  },
});

router.get('/seasons', async (req, res, next) => {
  const toSerialize = [];

  for await (const document of seasonModel.find().populate('judges')) {
    toSerialize.push(document);
  }

  const seasons = seasonsSerializer.serialize(toSerialize);

  res.send(seasons);
});

// GET seasons/{number}

const seasonSerializer = new JSONAPISerializer('seasons', {
  topLevelLinks: {
    self: (season) => `http://localhost:7000/seasons/${season.number}`
  },
  attributes: [
    'number',
    'judges',
    'contestants',
  ],
  judges: {
    ref: 'id',
    attributes: ['name', 'avatar'],
  },
  contestants: {
    ref: 'id',
    attributes: ['name', 'age', 'hometown', 'occupation', 'avatar'],
  },
  episodes: {
    ref: 'id',
    attributes: ['number', 'name', 'airDate'],
  },
});

router.get('/seasons/:number', async (req, res, next) => {
  const season = await seasonModel.findOne({ number: req.params.number })
    .populate('judges')
    .populate('contestants')
    .populate('episodes')
    .exec();

  res.send(seasonSerializer.serialize(season));
});

module.exports = router;
