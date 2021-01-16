const Serializer = require('../util/serializer');

class ChallengeSerializer extends Serializer {
  constructor(data) {
    super(data, [
      'episode',
      'type',
    ]);
  }

  serialize() {
    return {
      type: this.type,
    };
  }
}

module.exports = ChallengeSerializer;
