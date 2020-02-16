const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const judgeSchema = new Schema({
  id: String,
  name: String,
  avatar: String,
  season_ids: Array,
});

const Judge = mongoose.model('Judge', judgeSchema);

module.exports = Judge;
