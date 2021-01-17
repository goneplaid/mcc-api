const JSONAPISerializer = require('jsonapi-serializer').Serializer;
const judgeModel = require('../models/judge');

// SERIALIZER
const serializer = new JSONAPISerializer('seasons', {
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

module.exports = serializer;
