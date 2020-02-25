const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const episodeSchema = new Schema({
  //id: String,
  number: String,
  name: String,
  air_date: String,
  season_id: Number,
  challenge_ids: Array,
})

const Episode = mongoose.model('Episode', episodeSchema);

module.exports = Episode
