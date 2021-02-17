/*
  OVERVIEW:

  This script takes CSV data that was manually scrapped from Wikipedia and uses
  it to seed a mongoose database.

  EXPLANATION OF DATA USED:

  The data is divided into the three following groups (and CSV files):

  * Challenges:
    A set of CSV files that contain information for each challenge in every
    episode of a given season. They are organized in subdirectories by season.

  * Contestants:
    A set of CSV files that contain information about each contestant for a
    given season. They are organized in subdirectories by season.

  * Episodes:
    A set of CSV files that contain information describing each episode of a
    given season. They are organized in subdirectories by season.

  * Judges:
    A single CSV file that stores judges from all seasons as most are recurring
    participants to one, many or all (Gordon) seasons.

  EXPLANATION OF PROCESS:

  This script is based around the idea of individual seeders for the different
  types of models described above.

  Each "seeder" is handed a path to a csv file and season to which they belong,
  when needed, and is called to seed their data. Each seeder then uses the
  CsvReader and PojoSerializer classes to process each record and save it to the
  database using the application models in app/models.
  
  After each season model and their related models like episodes, contestants,
  and judges have been saved, they are then related by internal methods to each
  seeder class.
*/

const mongoose = require('mongoose');
const path = require('path');

const SeasonSeeder = require('./seeders/season');
const JudgeSeeder = require('./seeders/judge');
const EpisodeSeeder = require('./seeders/episode');
const ContestantSeeder = require('./seeders/contestant');
const ChallengeSeeder = require('./seeders/challenge');

require('../../app/lib/connect-db')();

// Update this to a process arg later on when we're dealing with reconstructing
// more seasons.
const SEASONS_TO_PROCESS = 2;

seedDatabase(SEASONS_TO_PROCESS);

async function seedDatabase(maxSeason) {
  purgeAllCollections();

  console.log('All collections purged!!');

  try {
    const seasons = new SeasonSeeder(maxSeason);
    const judges = new JudgeSeeder(path.join(__dirname, '../csv/judges.csv'));

    await seasons.seed();
    await judges.seed();

    for (let seasonDocument of seasons.documents) {
      const season = seasonDocument.number;
      const fileName = `season-${season}.csv`;

      const episodes = new EpisodeSeeder({
        season,
        csvPath: path.join(__dirname, `../csv/episodes/${fileName}`),
      });

      await episodes.seed(seasonToRelate = seasonDocument);

      const contestants = new ContestantSeeder({
        season,
        csvPath: path.join(__dirname, `../csv/contestants/${fileName}`),
      });

      await contestants.seed(seasonToRelate = seasonDocument);

      const challenges = new ChallengeSeeder({
        season,
        csvPath: path.join(__dirname, `../csv/challenges/${fileName}`),
      });

      await challenges.seed(seasonToRelate = seasonDocument);

      await relateDocuments({
        seasons,
        judges,
        episodes,
        contestants,
        challenges,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function purgeAllCollections() {
  await purgeCollection('seasons');
  await purgeCollection('judges');
  await purgeCollection('episodes');
  await purgeCollection('contestants');
  await purgeCollection('challenges');
  await purgeCollection('participants');
}

async function purgeCollection(name) {
  return mongoose.connection.dropCollection(name).catch(e => {
    if (e.message !== 'ns not found') {
      console.error(e.message);
    }
  });
}

async function relateDocuments(documents) {
  const {
    seasons,
    judges,
    episodes,
    contestants,
    challenges
  } = documents;

  await seasons.relateJudges(judges.documents);
  await seasons.relateEpisodes(episodes.documents);
  await seasons.relateContestants(contestants.documents);

  await judges.relateSeasons(seasons.documents);
  await challenges.relateEpisodes(episodes.documents);
  await episodes.relateChallenges(challenges.documents);
}
