const PojoSerializer = require('../pojo-serializer');
const CsvReader = require('../csv-reader');
const ContestantModel = require('../../../app/models/contestant');
const { API_URL } = require('../../../config/site.json');

class ContestantSeeder {
  constructor(options) {
    this.season = options.season;
    this.csvPath = options.csvPath;
    this.documents = [];
  }

  async seed() {
    const contestantReader = new CsvReader({
      season: this.season,
      csvDirectory: this.csvPath,
      serializer: ContestantSerializer,
    });

    await Promise.all(contestantReader.read().map(async data => {
      const document = new ContestantModel(data);

      await document.save();

      this.documents.push(document);

      console.log(`Contestant ${document.name} created.`);
    }));
  }
}

module.exports = ContestantSeeder;

class ContestantSerializer extends PojoSerializer {
  constructor(data, season) {
    super(data, [
      'name',
      'age',
      'hometown',
      'occupation',
    ]);

    this.season = season;
  }

  serialize() {
    const camelizedName = this.name
      .toLowerCase()
      .replace("'", '')
      .replace(/ /g, "_");

    const avatarUrl = `${API_URL}/assets/images/contestants`;
    const avatar = `${avatarUrl}/season_${this.season}/${camelizedName}.jpg`;

    this.avatar = avatar;

    return {
      name: this.name,
      age: this.age,
      hometown: this.hometown,
      occupation: this.occupation,
      avatar: this.avatar,
      season: this.season,
    };
  }
}
