const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: Schema.Types.String,
    required: true
  },
});

module.exports = mongoose.model('Episode', schema);
