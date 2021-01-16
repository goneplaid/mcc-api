const Serializer = require('../util/serializer');

class ParticipantSerializer extends Serializer {
  constructor(data) {
    super(data, [
      'episode',
      'challengeType',
      'participantType',
      'contestants',
      'result',
    ]);
  }

  serialize() {
    return {
      name: this.name,
      type: this.participantType,
      result: this.result,
      // challenge_id: this.challengeId,
      // contestant_ids: this.contestantIds,
    };
  }
}

module.exports = ParticipantSerializer;
