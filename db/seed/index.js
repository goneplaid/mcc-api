/*
  Script: index.js

  Overview:

    This node script takes data that was manually scrapped from Wikipedia and transformed into CSV
    files and uses it to seed a mongoose database.

  Explanation of data used:

    The data is divided into the three following categories:

      * Challenges: A set of CSV files that contain information for each challenge in every episode of a
        given season.
      * Contestants: A set of CSV files that contain information about each contestant for a given season.
      * Episodes: A set of CSV files that contain information describing each episode of a given season.

    The files are organized into three distict directories used to house the described data. Each file
    contains the relevant data for a particular season and is named after the season it contains said data
    for.

    One type of data that resides outside of the scope of any single given season are the judges as most
    are recurring participants to one, many or all (Gordon) seasons. Therefore, there is a single CSV file
    for the judges.
*/

// First, establish our connection to the database
const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.database.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  /* no-op */
});

// Some utilities from node-js
const path = require('path');
const fs = require('fs');

// The generic "reader" class, used to examine data from the csv files
const Reader = require('./util/reader');
const { nextTick } = require('process');

async function seedSeasons() {
  const SEASON_COUNT = 10;

  purgeCollection('seasons');

  const SeasonSerializer = require('./serializers/season');
  const SeasonModel = require('../../app/models/season').model;
  const seasonNumbers = Array.from({ length: SEASON_COUNT }, (_, i) => i + 1);

  return await Promise.all(seasonNumbers.map(async season => {
    const seasonData = new SeasonSerializer(season.toString()).serialize();

    try {
      const seasonDocument = await SeasonModel.create(seasonData);

      console.log(`season ${season} saved!`);

      return seasonDocument;
    } catch (error) {
      console.log(error);
    }
  }));
}

async function seedJudges(seasonDocuments) {
  purgeCollection('judges');

  const JudgeSerializer = require('./serializers/judge');

  // Setup our reader class for judges
  const judgeReader = new Reader({
    csvDirectory: path.join(__dirname, '../csv/judges.csv'),
    serializer: JudgeSerializer,
  });

  const JudgeModel = require('../../app/models/judge').model;

  for (let judge of judgeReader.records) {
    const judgeData = judge.serialize();
    const seasons = seasonDocuments.filter(season => judgeData.seasonNumbers.includes(season.number));
    const judgeDocument = new JudgeModel(judgeData);

    judgeDocument.seasons.push(...seasons);

    try {
      await judgeDocument.save();

      console.log(`judge ${judgeDocument.name} saved!`);
    } catch (error) {
      console.log(error);
    }
  }
}

async function seedDatabase() {
  const seasonDocuments = await seedSeasons();

  seedJudges(seasonDocuments);
}

function purgeCollection(name) {
  mongoose.connection.dropCollection(name, function (error, result) {
    if (!result) console.log(`collection "${name}" successfully dropped.`);
    if (error && !error.message.includes('ns not found')) console.info(error);
  });
}

seedDatabase();
