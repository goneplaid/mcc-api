const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// SCHEMA

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true
  },
  age: {
    type: Schema.Types.Number,
    required: true
  },
  hometown: {
    type: Schema.Types.String,
    required: true
  },
  occupation: {
    type: Schema.Types.String,
    required: true
  },
  avatar: {
    type: Schema.Types.String,
    required: true
  },
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Season'
  }],
})

// MODEL

const model = mongoose.model('Contestant', schema);

// SERIALIZER

const serializer = new JSONAPISerializer('contestants', {
  attributes: [
    'name',
    'age',
    'hometown',
    'occupation',
    'avatar'
  ]
});

module.exports = {
  schema,
  model,
  serializer
};