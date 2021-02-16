const PojoSerializer = require('../pojo-serializer');
const CsvReader = require('../csv-reader');
const JudgeModel = require('../../../app/models/judge');
const { API_URL } = require('../../../config/site.json');

class JudgeSeeder {
  constructor(csvPath) {
    this.csvPath = csvPath;
    this.documents = [];
  }

  async seed() {
    const judgeReader = new CsvReader({
      csvDirectory: this.csvPath,
      serializer: JudgeSerializer,
    });

    for (let data of judgeReader.read()) {
      const document = new JudgeModel(data);

      await document.save();

      this.documents.push(document);

      console.log(`Judge ${document.name} created.`);
    }
  }

  async relateSeasons(seasonDocuments) {
    for (let judge of this.documents) {
      const seasons = seasonDocuments.filter(season => {
        return judge.seasons.includes(season.number);
      });

      if (!seasons.length) return;

      judge.seasonRefs = seasons;

      await judge.save();

      console.log(`Season documents related to judge ${judge.name}.`);
    }
  }
}

module.exports = JudgeSeeder;

class JudgeSerializer extends PojoSerializer {
  constructor(data) {
    super(data, [
      'name',
      'seasons',
    ]);
  }

  serialize() {
    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatarUrl = `${API_URL}/assets/images/judges`;
    const avatar = `${avatarUrl}/${camelizedName}.png`;

    this.avatar = avatar;

    return {
      name: this.name,
      seasons: this.seasons.split(','),
      avatar: this.avatar,
    };
  }
}
