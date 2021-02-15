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

    judgeReader.read().map(async data => {
      const document = new JudgeModel(data);

      await document.save();

      this.documents.push(document);

      console.log(`Judge ${document.name} created.`);
    });
  }
}

module.exports = JudgeSeeder;

class JudgeSerializer extends PojoSerializer {
  constructor(data) {
    super(data, [
      'name',
      'seasons',
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatarUri = `${API_URL}/assets/images/judges`;
    const avatar = `${avatarUri}/${camelizedName}.png`;

    this.avatar = avatar;
  }

  serialize() {
    return {
      name: this.name,
      seasons: this.seasons.split(','),
      avatar: this.avatar,
    };
  }
}
