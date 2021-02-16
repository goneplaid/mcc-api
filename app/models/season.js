const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  number: {
    type: Schema.Types.String,
    required: true
  },
  judgeRefs: [{
    type: Schema.Types.ObjectId,
    ref: 'Judge'
  }],
  contestantRefs: [{
    type: Schema.Types.ObjectId,
    ref: 'Contestant'
  }],
  episodeRefs: [{
    type: Schema.Types.ObjectId,
    ref: 'Episode'
  }]
});

module.exports = mongoose.model('Season', schema);
