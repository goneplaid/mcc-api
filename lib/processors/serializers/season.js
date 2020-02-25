const mongoose = require('mongoose');
const Serializer = require('../util/serializer');

const ObjectId = mongoose.Types.ObjectId;

class SeasonSerializer extends Serializer {
  constructor(number) {
    super([number], { number: 0 });

    this.id = new ObjectId;
    this.judgeIds = [];
    this.contestantIds = [];
    this.episodeIds = [];
  }

  serialize() {
    return {
      _id: this.id,
      number: this.number,
      judge_ids: this.judgeIds,
      contestant_ids: this.contestantIds,
      episode_ids: this.episodeIds,
    };
  }
}

module.exports = SeasonSerializer;
