const PojoSerializer = require('../pojo-serializer');

class ChallengeSerializer extends PojoSerializer {
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
