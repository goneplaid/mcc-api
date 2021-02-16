const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  number: {
    type: Schema.Types.String,
    required: true
  },
  season: {
    type: Schema.Types.String,
    required: true
  },
  seasonRef: {
    type: Schema.Types.ObjectId,
    ref: 'Season'
  },
  challengeRefs: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  name: {
    type: Schema.Types.String,
    required: true
  },
  airDate: {
    type: Schema.Types.String,
    required: true
  },
});

module.exports = mongoose.model('Episode', schema);
