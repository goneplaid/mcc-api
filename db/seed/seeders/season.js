const SeasonSerializer = require('../serializers/season');
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

      console.log(`Season ${document.number} created!`);
    }
  }
}

module.exports = SeasonSeeder;
