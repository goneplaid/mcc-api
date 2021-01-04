const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// SCHEMA

const schema = new Schema({
  //id: String,
  name: String,
  age: Number,
  hometown: String,
  occupation: String,
  avatar: String,
  season_id: String,
  participant_ids: Array,
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
