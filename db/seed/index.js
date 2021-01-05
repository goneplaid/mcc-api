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

async function seedSeasons() {
  const SEASON_COUNT = 10;

  // Clear out the season collection
  purgeCollection('seasons');

  // Our season serializer
  const SeasonSerializer = require('./serializers/season');

  // Season model related classes
  const seasonModel = require('../../app/models/season').model;
  const seasonNumbers = Array.from({ length: SEASON_COUNT }, (_, i) => i + 1);

  for (let season of seasonNumbers) {
    const seasonRecord = new SeasonSerializer(season.toString());

    try {
      const seasonDocument = await seasonModel.create(seasonRecord);

      console.log(`season ${seasonDocument} saved!`);
    } catch (error) {
      console.log(error);
    }
  }
}

function purgeCollection(name) {
  mongoose.connection.dropCollection(name, function (error, result) {
    if (!result) console.log(`collection "${name}" successfully dropped.`);
    if (error && !error.message.includes('ns not found')) console.info(error);
  });
}

seedSeasons();
