const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// SERIALIZER
const serializer = new JSONAPISerializer('seasons', {
  topLevelLinks: {
    // TODO: set up some reusable URI helpers
    self: 'http://localhost:7000/seasons',
  },
  dataLinks: {
    self: (model) => `http://localhost:7000/seasons/${model.number}`
  },
  attributes: [
    'number',
  ]
});

module.exports = serializer;
