const mongoose = require('mongoose');
const Serializer = require('../util/serializer');

const ObjectId = mongoose.Types.ObjectId;

class EpisodeSerializer extends Serializer {
  constructor(data, seasonNumber) {
    super(data, {
      number: 0,
      name: 1,
      airDate: 2,
    });

    this.id = new ObjectId;
    this.seasonNumber = seasonNumber;
    this.seasonId = null;
    this.challengeIds = [];
  }

  serialize() {
    return {
      _id: this.id,
      number: this.number,
      name: this.name,
      air_date: this.airDate,
      season_id: this.seasonId,
      challenge_ids: this.challengeIds,
    };
  }
}

module.exports = EpisodeSerializer;
