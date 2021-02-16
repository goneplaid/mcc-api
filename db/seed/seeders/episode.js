const PojoSerializer = require('../pojo-serializer');
const CsvReader = require('../csv-reader');
const EpisodeModel = require('../../../app/models/episode');

class EpisodeSeeder {
  constructor(options) {
    this.season = options.season;
    this.csvPath = options.csvPath;
    this.documents = [];
  }

  async seed(seasonDocument) {
    const episodesReader = new CsvReader({
      season: this.season,
      csvDirectory: this.csvPath,
      serializer: EpisodeSerializer,
    });

    for (let data of episodesReader.read()) {
      const document = new EpisodeModel(data);

      document.seasonRef = seasonDocument;

      await document.save();

      this.documents.push(document);

      console.log(`Episode ${document.number}, ${document.name}, created.`);
    }
  }

  async relateChallenges(challengeDocuments) {
    for (let episode of this.documents) {
      const challenges = challengeDocuments.filter(challenge => {
        if (challenge.episode === episode.number) return challenge;
      });

      if (!challenges.length) {
        throw new Error(
          `No challenge models for episode ${episode.number}!`
        );
      }

      episode.challengeRefs = challenges;
      episode.save();

      console.log(`${challenges.length} challenges related to episode ${episode.number}.`);
    }
  }
}

module.exports = EpisodeSeeder;

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
      name: this.name,
      airDate: this.airDate,
      season: this.season,
    };
  }
}
