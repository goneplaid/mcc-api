const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengeSchema = new Schema({
  //id: String,
  type: String,
  episode_id: String,
  participant_ids: Array,
})

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
