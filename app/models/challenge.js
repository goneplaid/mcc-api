const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  type: {
    type: Schema.Types.String,
    required: true
  },
  episode: {
    type: Schema.Types.ObjectId,
    ref: 'Episode'
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Participant'
  }],
})

module.exports = mongoose.model('Challenge', schema);
