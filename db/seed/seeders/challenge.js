const PojoSerializer = require('../pojo-serializer');
const CsvReader = require('../csv-reader');
const ChallengeModel = require('../../../app/models/challenge');
const challengeTypes = require('../challenge-type-code-mappings');

class ChallengeSeeder {
  constructor(options) {
    this.season = options.season;
    this.csvPath = options.csvPath;
    this.documents = [];
  }

  async seed(seasonDocument) {
    const challengesReader = new CsvReader({
      csvDirectory: this.csvPath,
      parserOptions: {
        ltrim: true,
        relax_column_count: true,
      },
      dataReader: readChallenges,
      dataReaderParams: {
        challengeTypes
      },
    });

    for (let serializer of challengesReader.read()) {
      const data = serializer.serialize();

      data.season = this.season;
      data.seasonRef = seasonDocument;

      const document = new ChallengeModel(data);

      await document.save();

      this.documents.push(document);

      console.log(`Challenge episode ${document.episode} - ${document.type} created.`);
    }
  }

  async relateEpisodes(episodeDocuments) {
    for (let challenge of this.documents) {
      const episode = episodeDocuments.filter(episode => {
        if (episode.number === challenge.episode) return challenge;
      });

      if (!episode.length) {
        throw new Error(
          `No episode model for challenge ${challenge.type}, episode ${challenge.episode}!`
        )
      }

      challenge.episodeRef = episode[0];
      challenge.save();

      console.log(`Episode ${episode[0].number} related to challenge ${challenge.type}.`);
    }
  }
}

module.exports = ChallengeSeeder;

function readChallenges(data, { challengeTypes }) {
  const episodeNumbers = data.shift().slice(2);
  const challengeData = data.shift().slice(2);

  return challengeData.map((challenge, index) => {
    const challengeTypeCode = challenge.split('-')[0];

    const type = challengeTypes.find(type => type.code === challengeTypeCode);

    if (!type) throw new Error(`challenge type not found! episode: ${episodeNumbers[index]}, challengeData: ${challenge}`);

    return new ChallengeSerializer([
      episodeNumbers[index],
      type.name,
    ]);
  });
}

class ChallengeSerializer extends PojoSerializer {
  constructor(data, season) {
    super(data, [
      'episode',
      'type',
    ]);
  }

  serialize() {
    return {
      episode: this.episode,
      type: this.type,
    };
  }
}
