const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true
  },
  avatar: {
    type: Schema.Types.String,
    required: true
  },
  seasons: [{
    type: Schema.Types.String,
    required: true
  }],
  seasonRefs: [{
    type: Schema.Types.ObjectId,
    ref: 'Season'
  }],
});

module.exports = mongoose.model('Judge', schema);
