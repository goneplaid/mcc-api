const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA
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

// MODEL
const model = mongoose.model('Challenge', schema);

// EXPORTS
module.exports = {
  schema,
  model,
};
