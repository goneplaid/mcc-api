const Serializer = require('../util/serializer');

class ParticipantSerializer extends Serializer {
  constructor(data) {
    super(data, {
      id: 0,
      episodeNumber: 1,
      challengeType: 2,
      participantType: 3,
      contestants: 4,
      result: 5,
    });

    this.name = null;
    this.challengeId = null;
    this.contestantIds = null;
  }

  serialize() {
    return `
  {
    id: "${this.id}",
    name: "${this.name}",
    type: "${this.participantType}",
    result: "${this.result}",
    challengeId: "${this.challengeId}",
    contestantIds: ${JSON.stringify(this.contestantIds)},
  }`;
  }
}

module.exports = ParticipantSerializer;
