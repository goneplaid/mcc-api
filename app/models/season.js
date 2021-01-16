const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Season', schema);
