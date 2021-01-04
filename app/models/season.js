const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

// SCHEMA

const schema = new Schema({
  //id: String,
  number: String,
  judge_ids: Array,
  contestant_ids: Array,
  episode_ids: Array
});

// MODEL

const model = mongoose.model('Season', schema);

// SERIALIZER

const serializer = new JSONAPISerializer('seasons', {
  attributes: ['number']
});

// EXPORTS

module.exports = {
  schema,
  model,
  serializer
};
