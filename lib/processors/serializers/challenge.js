const uuid = require('uuid/v4'); // for random uuid's
const Serializer = require('../util/serializer');

class ChallengeSerializer extends Serializer {
  constructor(data) {
    super(data, {
      id: 0,
      type: 1,
      episodeNumber: 2,
    });

    this.episodeId = null;
    this.participantIds = null;
  }

  serialize() {
    return `
  {
    id: "${this.id}",
    type: "${this.type}",
    episodeId: "${this.episodeId}",
    participantIds: ${JSON.stringify(this.participantIds)},
  }`;
  }
}

module.exports = ChallengeSerializer;
