const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA
const schema = new Schema({
  number: {
    type: Schema.Types.String,
    required: true
  },
  name: {
    type: Schema.Types.String,
    required: true
  },
  airDate: {
    type: Schema.Types.String,
    required: true
  },
  season: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  judges: [{
    type: Schema.Types.ObjectId,
    ref: 'Judge'
  }],
  challenges: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
})

// MODEL
const model = mongoose.model('Episode', schema);

// EXPORTS
module.exports = {
  schema,
  model,
};
