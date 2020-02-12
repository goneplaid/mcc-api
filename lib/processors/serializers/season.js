const uuid = require('uuid/v4'); // for random uuid's
const Serializer = require('../util/serializer');

class SeasonSerializer extends Serializer {
  constructor(number) {
    super([number], { number: 0 });

    this.id = uuid();
    this.judgeIds = [];
    this.contestantIds = [];
    this.episodeIds = [];
  }

  serialize() {
    return {
      id: this.id,
      number: this.number,
      judge_ids: this.judgeIds,
      contestant_ids: this.contestantIds,
      episode_ids: this.episodeIds,
    };
  }
}

module.exports = SeasonSerializer;
