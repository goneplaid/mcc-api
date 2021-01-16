const Serializer = require('../util/serializer');

class EpisodeSerializer extends Serializer {
  constructor(data, season) {
    super(data, [
      'number',
      'name',
      'airDate',
    ]);

    this.season = season;
  }

  serialize() {
    return {
      number: this.number,
      name: this.name,
      airDate: this.airDate,
    };
  }
}

module.exports = EpisodeSerializer;