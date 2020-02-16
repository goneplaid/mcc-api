const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestantSchema = new Schema({
  id: String,
  name: String,
  age: Number,
  hometown: String,
  occupation: String,
  avatar: String,
  season_id: String,
  participant_ids: Array,
})

const Contestant = mongoose.model('Contestant', contestantSchema);

module.exports = Contestant;
