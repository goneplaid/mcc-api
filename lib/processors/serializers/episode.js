const uuid = require('uuid/v4'); // for random uuid's
const Serializer = require('../util/serializer');

class EpisodeSerializer extends Serializer {
  constructor(data, seasonNumber) {
    super(data, {
      number: 0,
      name: 1,
      airDate: 2,
    });

    this.id = uuid();
    this.seasonNumber = seasonNumber;
    this.seasonId = null;
    this.challengeIds = [];
  }

  serialize() {
    return {
      id: this.id,
      number: this.number,
      name: this.name,
      air_date: this.airDate,
      season_id: this.seasonId,
      challenge_ids: this.challengeIds,
    };
  }
}

module.exports = EpisodeSerializer;
