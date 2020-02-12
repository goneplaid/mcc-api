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
    return `
  {
    id: "${this.id}",
    number: "${this.number}",
    judgeIds: ${JSON.stringify(this.judgeIds)},
    contestantIds: ${JSON.stringify(this.contestantIds)},
    episodeIds: ${JSON.stringify(this.episodeIds)},
  }`;
  }
}

module.exports = SeasonSerializer;
