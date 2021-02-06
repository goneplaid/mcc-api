const PojoSerializer = require('../pojo-serializer');

class EpisodeSerializer extends PojoSerializer {
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
      seasonNumber: this.seasonNumber,
      name: this.name,
      airDate: this.airDate,
    };
  }
}

module.exports = EpisodeSerializer;
