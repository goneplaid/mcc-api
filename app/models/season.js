const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const seasonSchema = new Schema({
  //id: String,
  number: String,
  judge_ids: Array,
  contestant_ids: Array,
  episode_ids: Array
});

const Season = mongoose.model('Season', seasonSchema);

module.exports = Season;
