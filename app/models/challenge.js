const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  season: {
    type: Schema.Types.String,
    required: true,
  },
  seasonRef: {
    type: Schema.Types.ObjectId,
    ref: 'Season',
  },
  episode: {
    type: Schema.Types.String,
    required: true,
  },
  episodeRef: {
    type: Schema.Types.ObjectId,
    ref: 'Episode',
  },
  type: {
    type: Schema.Types.String,
    required: true,
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Participant',
  }],
})

module.exports = mongoose.model('Challenge', schema);
