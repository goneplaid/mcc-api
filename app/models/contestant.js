const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    type: Schema.Types.String,
    required: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Participant'
  }],
})

module.exports = mongoose.model('Contestant', schema);
