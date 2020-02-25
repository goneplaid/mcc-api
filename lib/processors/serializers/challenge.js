const mongoose = require('mongoose');
const Serializer = require('../util/serializer');

const ObjectId = mongoose.Types.ObjectId;

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
    return {
      _id: this.id,
      type: this.type,
      episode_id: this.episodeId,
      participant_ids: this.participantIds,
    };
  }
}

module.exports = ChallengeSerializer;
