const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SCHEMA
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
    type: Schema.Types.ObjectId,
    ref: 'Season'
  }],
});

// MODEL
const model = mongoose.model('Judge', schema);

// EXPORTS
module.exports = {
  schema,
  model,
};
