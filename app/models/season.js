const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// SCHEMA
const schema = new Schema({
  number: {
    type: Schema.Types.String,
    required: true
  },
  judges: [{
    type: Schema.Types.ObjectId,
    ref: 'Judge'
  }],
  contestants: [{
    type: Schema.Types.ObjectId,
    ref: 'Contestant'
  }],
  episodes: [{
    type: Schema.Types.ObjectId,
    ref: 'Episode'
  }]
});

// schema.set('toObject', { virtuals: true })
// schema.set('toJSON', { virtuals: true })

// MODEL
const model = mongoose.model('Season', schema);

// SERIALIZER
const serializer = new JSONAPISerializer('seasons', {
  topLevelLinks: {
    // TODO: set up some reusable URI helpers
    self: 'http://localhost:7000/seasons'
  },
  attributes: [
    '_id',
    'number',
  ]
});

// EXPORTS
module.exports = {
  schema,
  model,
  serializer
};
