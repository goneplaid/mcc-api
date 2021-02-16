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
    for (let season of this.documents) {
      const judges = judgeDocuments.filter(judge => {
        return judge.seasons.includes(season.number);
      });

      if (!judges.length) return;

      season.judgeRefs = judges;

      await season.save();

      console.log(`Judge documents related to season ${season.number}.`);
    }
  }

  async relateEpisodes(episodeDocuments) {
    for (let season of this.documents) {
      const episodes = episodeDocuments.filter(episode => {
        return episode.season === season.number;
      });

      if (!episodes.length) return;

      season.episodeRefs = episodes;

      await season.save();

      console.log(`Episode documents related to season ${season.number}.`);
    }
  }

  async relateContestants(contestantDocuments) {
    for (let season of this.documents) {
      const contestants = contestantDocuments.filter(episode => {
        return episode.season === season.number;
      });

      if (!contestants.length) return;

      season.contestantRefs = contestants;

      await season.save();

      console.log(`Contestant documents related to season ${season.number}.`);
    }
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
