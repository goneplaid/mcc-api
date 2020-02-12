// This node script takes CSV data for contestant data that was manually scraped from Wikipedia and output fixture
// data for ember-cli-mirage.

/*
  Script: index.js

  Overview:

    This node-js script takes CSV data for MC related data that was manually scraped from Wikipedia
    and processes it so that fixture data can be serialized and ember data models can be hydrated.

  Purpose:

    This data will ultimately live in a mongodb database or some other data store, but it still needs
    to be processed for use in this application. At this point in the project, it makes sense to create
    fixture data as the UI is still being created. And because it's ultimately static data that will
    never change, it's safe to proceed in this way. Having to design and create a data store, backend
    API *and* a front end all at the same time would be too much cognitive overhead when designing each
    part of this application.

  Explanation of data used:

    The data used to create all of the fixtures for hydrating our front end models was manually scraped
    from Wikipedia and then slightly modified to make it more comprehensible and processable.

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

  Explanation of the algorithm that processes and relates the data:

    The main algorithm that processes data and ultimately relates it all is a recursive function that
    iteratively processes each season. This choice was made so that each season can be processed in a
    blocking fashion before the next season is processed. Originally, asynchronous functions were used to
    read each CSV file. This complicated the processing when using something like a simple loop instead.

    However, I ultimately changed the data-reading classes to use synchronous functions which alleviated
    this need, but I'm a lazy bastard and didn't feel like changing the entire approach to processing
    the CSV files, so this design choice is an artifact of the original implementation ¯\_(ツ)_/¯

    As each season is processed, "reader" classes are used to pull in data from the three different CSV
    file types that encompass all data needed to reconstruct each season as a series of data models.

    Those reader classes iterate over CSV data rows and are transformed into simple POJO's to represent
    each entity. These are stored in "serializer" classes that are ultimately used to serialize the records
    into the fixture data.

    Data for the episodes and contestants is very simple and straight-forward. However, the "challenges"
    CSV data is a lot more complex and nuanced and therefore doesn't fit this simple approach to processing
    the data. Because of this, "custom-reader" functions were created to handle the extraction of specific
    information that we extract from the challenge data. These include:

      * Challenges: A representation of a given challenge in an episode of MC.
      * Participants: A participant in a given challenge; either a team of contestants or an individual one.
      * Finishes: The extraction of a given participants finishing place during the course of a season.

    The "custom-reader" functions work in conjunction with the more simplistic "reader" and "serializer"
    classes. The reader object instances simply hand off their processing responsibilities to the functions
    that harvest this more complex CSV data.

    At the end of processing for each season, a set of "relation" functions are called that relate all
    of the data models to one another. These are simple one-off functions that handle each of the types of
    relations that we want the models to have to the greater ecosystem of MC models.

    Once all seasons have been processed, a final FINISH() function is called which coordinates the
    serialization of the processed data models into their final fixture data files.
*/

// Some utilities from node-js
const path = require('path');
const fs = require('fs');

// The generic "reader" class
const Reader = require('./util/reader');

// Serializers and custom serializers for each of the different model and information types.
const JudgeSerializer = require('./serializers/judge');
const SeasonSerializer = require('./serializers/season');
const ContestantSerializer = require('./serializers/contestant');
const EpisodeSerializer = require('./serializers/episode');
const challengeReader = require('./custom-readers/challenge');
const participantReader = require('./custom-readers/participant');

// Challenge-type code mappings
const challengeTypes = require('./challenge-type-code-mappings');

// Relation functions
const {
  relateSeasonToContestants,
  relateSeasonToEpisodes,
  relateSeasonsToJudges,
  relateChallengesToEpisodes,
  relateParticipantsToContestants,
  relateParticipantsToChallenges,
  relateEliminationsToContestants,
} = require('./relations');

const TOTAL_SEASONS = 10;

// Still using these for the recursive function that can totally be replaced now but that I'm still too
// lazy to change ¯\_(ツ)_/¯
let seasonCount = 1;
let season;

// Array's to store all of the serialized entities for all seasons. These are iterated over at the end of
// this algorithm to write each data fixture.
const seasons = [];
const judges = [];
const contestants = [];
const episodes = [];
const challenges = [];
const participants = [];

// Set up the Judge reader since they exist mostly outside of the scope of any given season.
const judgeReader = new Reader({
  csvDirectory: path.join(__dirname, '../csv/judges.csv'),
  serializer: JudgeSerializer,
});

// Primary function of this algorithm
function processSeasons() {
  season = seasonCount.toString();

  if (seasonCount > TOTAL_SEASONS) {
    relateSeasonsToJudges(seasons, judgeReader.records);

    judges.push(...judgeReader.records)

    FINISH();

    return;
  }

  const seasonRecord = new SeasonSerializer(season);
  seasons.push(seasonRecord);

  const contestantsReader = new Reader({
    season,
    csvDirectory: path.join(__dirname, `../csv/contestants/season-${season}.csv`),
    serializer: ContestantSerializer,
  });


  relateSeasonToContestants(seasonRecord, contestantsReader.records);

  contestants.push(...contestantsReader.records);

  const episodesReader = new Reader({
    season,
    csvDirectory: path.join(__dirname, `../csv/episodes/season-${season}.csv`),
    serializer: EpisodeSerializer,
  });

  relateSeasonToEpisodes(seasonRecord, episodesReader.records);

  episodes.push(...episodesReader.records);

  // Process the rest of this after we get more of the front end in place.
  if (seasonCount < 3) {
    const challengesReader = new Reader({
      season,
      csvDirectory: path.join(__dirname, `../csv/challenges/season-${season}.csv`),
      parserOptions: {
        ltrim: true,
        relax_column_count: true,
      },
      dataReader: challengeReader,
      dataReaderParams: {
        challengeTypes
      },
    });

    relateChallengesToEpisodes(challengesReader.records, episodesReader.records);

    challenges.push(...challengesReader.records);

    const participantsReader = new Reader({
      season,
      csvDirectory: path.join(__dirname, `../csv/challenges/season-${season}.csv`),
      parserOptions: {
        ltrim: true,
        relax_column_count: true,
      },
      dataReader: participantReader,
      dataReaderParams: {
        challengeTypes
      }
    });

    relateParticipantsToContestants(participantsReader.records, contestantsReader.records);
    relateParticipantsToChallenges(participantsReader.records, challengesReader.records, episodesReader.records);

    participants.push(...participantsReader.records);
  }

  // Just keep goin', man
  processSeasons(++seasonCount);
}

// Let the fun begin!
processSeasons(seasonCount);

// All done, write all this shit to the FS
function FINISH() {
  writeRecordData(seasons, 'lib/fixtures/seasons.js');
  writeRecordData(judges, 'lib/fixtures/judges.js');
  writeRecordData(contestants, 'lib/fixtures/contestants.js');
  writeRecordData(episodes, 'lib/fixtures/episodes.js');
  writeRecordData(challenges, 'lib/fixtures/challenges.js');
  writeRecordData(participants, 'lib/fixtures/participants.js');

  console.log('dun!');
}

function writeRecordData(records, filePath) {
  const recordData = records.map((record) => {
    return record.serialize();
  });

  // For Ember/Mirage
  const output = JSON.stringify(`[${recordData.join()}]`, null, 2);

  // For JSON (node express API)
  // const output = `[${recordData.join()}]`;
  // const json = JSON.stringify(output, null, 2)

  fs.writeFile(filePath, output, 'utf8', function(args) {
    // No-op, write file complete
  });
}
