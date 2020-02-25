const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const participantSchema = new Schema({
  //id: String,
  name: String,
  type: String,
  result: String,
  challenge_id: Number,
  contestant_ids: Array,
})

const Contestant = mongoose.model('Participant', participantSchema);

module.exports = Contestant;
