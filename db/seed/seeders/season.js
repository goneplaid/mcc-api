const PojoSerializer = require('../pojo-serializer');
const SeasonModel = require('../../../app/models/season');

class SeasonSeeder {
  constructor(maxSeason) {
    this.maxSeason = maxSeason;
    this.documents = [];
  }

  async seed() {
    const seasons = Array.from({ length: this.maxSeason }, (_, i) => i + 1);

    for (let season of seasons) {
      const data = new SeasonSerializer(season.toString()).serialize();
      const document = new SeasonModel(data);

      await document.save();

      this.documents.push(document);

      console.log(`Season ${document.number} created.`);
    }
  }

  async relateJudges(judgeDocuments) {
    await Promise.all(this.documents.map(async season => {
      const judges = judgeDocuments.filter(judge => {
        return judge.seasons.includes(season.number);
      });

      if (!judges.length) return;

      season.judgeRefs = judges;

      await season.save();

      console.log(`Judge documents related to season ${season.number}.`);
    }));
  }
}

module.exports = SeasonSeeder;

class SeasonSerializer extends PojoSerializer {
  constructor(number) {
    super([number], ['number']);
  }

  serialize() {
    return {
      number: this.number,
    };
  }
}
