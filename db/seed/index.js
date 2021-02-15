/*
  Script: db/seed/index.js

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
*/

const mongoose = require('mongoose');
const path = require('path');

const SeasonSeeder = require('./seeders/season');

require('../../app/lib/connect-db')();

const SEASONS_TO_PROCESS = 2;

seedDatabase(SEASONS_TO_PROCESS);

async function seedDatabase(maxSeason) {
  purgeAllCollections();

  console.log('All collections purged');

  try {
    const seasons = new SeasonSeeder(maxSeason);

    await seasons.seed();

    /*
    await judgeSeeder.seed({
      maxSeason,
      data: judgeCsvData,
      seasons: seasonSeeder.documents,
    });

    await contestantSeeder.seed({
      maxSeason,
      csvPath: contestantCsvPath,
      seasons: seasonSeeder.documents,
    });

    await episodeSeeder.seed({
      maxSeason,
      csvPath: episodeCsvPath,
      seasons: seasonSeeder.documents,
    });

    await challengeSeeder.seed({
      maxSeason,
      csvPath: challengeCsvPath,
      episodes: episodeSeeder.documents,
      contestants: contestantSeeder.documents,
    });
    */

  } catch (error) {
    console.error(error);
  }
}

async function purgeAllCollections() {
  await purgeCollection('seasons');
  await purgeCollection('contestants');
  await purgeCollection('episodes');
  await purgeCollection('judges');
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

