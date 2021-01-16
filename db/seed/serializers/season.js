const Serializer = require('../util/serializer');

class SeasonSerializer extends Serializer {
  constructor(number) {
    super([number], ['number']);

    this.judgeIds = [];
    this.contestantIds = [];
    this.episodeIds = [];
  }

  serialize() {
    return {
      number: this.number,
    };

    /*
      judge_ids: this.judgeIds,
      contestant_ids: this.contestantIds,
      episode_ids: this.episodeIds,
    */
  }
}

module.exports = SeasonSerializer;
