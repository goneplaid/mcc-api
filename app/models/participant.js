const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA
const schema = new Schema({
  name: {
    type: Schema.Types.String,
    required: false
  },
  type: {
    type: Schema.Types.String,
    required: false
  },
  result: {
    type: Schema.Types.String,
    required: true
  },
  challenge: {
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  },
  contestants: [{
    type: Schema.Types.ObjectId,
    ref: 'Contestant'
  }],
})

// MODEL
const model = mongoose.model('Participant', schema);

// EXPORTS
module.exports = {
  schema,
  model,
};
