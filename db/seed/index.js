/*
  Script: index.js

  Overview:

    This NodeJS script takes data that was manually scrapped from Wikipedia, transformed into CSV
    files, and then uses it to seed a mongoose database.
    
    All models are created locally and related and then finally saved to the database.

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

const mongoose = require('mongoose');
const path = require('path');

const SeasonSerializer = require('./serializers/season');
const ContestantSerializer = require('./serializers/contestant');
const EpisodeSerializer = require('./serializers/episode');

const Reader = require('./util/reader');
const challengeReader = require('./custom-readers/challenge');
const participantReader = require('./custom-readers/participant');

const SeasonModel = require('../../app/models/season');
const ContestantModel = require('../../app/models/contestant').model;
const EpisodeModel = require('../../app/models/episode').model;
const ChallengeModel = require('../../app/models/challenge').model;
const ParticipantModel = require('../../app/models/participant').model;

const challengeTypes = require('./challenge-type-code-mappings');

// Fist, connect to our data store
require('../../app/middleware/connect-db')();

async function createSeasons(maxSeason) {
  console.log('...creating seasons\n');

  const seasons = Array.from({ length: maxSeason }, (_, i) => i + 1);

  for (let season of seasons) {
    console.log(`processing season ${season}`);
    console.log('--------------------------');

    const seasonData = new SeasonSerializer(season.toString()).serialize();
    const seasonDocument = new SeasonModel(seasonData);

    const contestantDocuments = await createContestants(seasonDocument);
    const episodeDocuments = await createEpisodes(seasonDocument, contestantDocuments);

    seasonDocument.contestants = contestantDocuments;
    seasonDocument.episodes = episodeDocuments;

    await seasonDocument.save();

    console.log('--------------------------');
    console.log(`Season ${seasonDocument.number} document created and saved!`);
    console.log('==========================\n');
  };
}

async function createContestants(seasonDocument) {
  const contestantsReader = new Reader({
    season: seasonDocument.number,
    csvDirectory: path.join(__dirname, `../csv/contestants/season-${seasonDocument.number}.csv`),
    serializer: ContestantSerializer,
  });

  const contestantDocuments = await Promise.all(contestantsReader.records.map(async contestantData => {
    const contestantDocument = new ContestantModel(contestantData);
    contestantDocument.season = seasonDocument;

    await contestantDocument.save();

    return contestantDocument;
  }));

  console.log(`${contestantDocuments.length} contestant documents created and saved...`);

  return contestantDocuments;
}

async function createEpisodes(seasonDocument, contestantDocuments) {
  const season = seasonDocument.number;
  const episodesReader = new Reader({
    season,
    csvDirectory: path.join(__dirname, `../csv/episodes/season-${season}.csv`),
    serializer: EpisodeSerializer,
  });

  const challengesReader = createCustomChallengeReader(season);
  const participantsReader = createCustomParticipantReader(season);

  const episodeDocuments = await Promise.all(episodesReader.records.map(async episodeData => {
    const episodeDocument = new EpisodeModel(episodeData);
    episodeDocument.season = seasonDocument;

    const episodeNumber = episodeDocument.number;

    const challengeDocuments = await createChallenges(
      challengesReader.records.filter(challenge => challenge.episode === episodeNumber),
      participantsReader.records.filter(participant => participant.episode === episodeNumber),
      episodeDocument,
      contestantDocuments
    );

    episodeDocument.challenges = challengeDocuments;

    await episodeDocument.save();

    return episodeDocument;
  }));

  console.log(`${episodeDocuments.length} episode documents created and saved...`);

  return episodeDocuments;
}

async function createChallenges(challenges, participants, episodeDocument, contestantDocuments) {
  const challengeDocuments = await Promise.all(challenges.map(async challengeData => {
    const challengeDocument = new ChallengeModel(challengeData);
    challengeDocument.episode = episodeDocument;

    const participantDocuments = await createParticipants(participants, challengeDocument, contestantDocuments);
    challengeDocument.participants = participantDocuments;

    await challengeDocument.save();

    return challengeDocument;
  }));

  console.log(`${challengeDocuments.length} challenge documents created and saved...`);

  return challengeDocuments;
}

async function createParticipants(participants, challengeDocument, contestantDocuments) {
  const participantDocuments = await Promise.all(participants.map(async participantData => {
    const participantDocument = new ParticipantModel(participantData);
    const contestants = contestantDocuments.filter(contestant => {
      return participantData.contestants.includes(contestant.name);
    });

    participantDocument.contestants = contestants;
    participantDocument.challenge = challengeDocument;

    await participantDocument.save();

    return participantDocument;
  }));

  console.log(`${participantDocuments.length} participant documents created and saved...`);

  return participantDocuments;
}

const challengesCsvPath = (season) => `../csv/challenges/season-${season}.csv`;

function createCustomChallengeReader(season) {
  return new Reader({
    csvDirectory: path.join(__dirname, challengesCsvPath(season)),
    parserOptions: {
      ltrim: true,
      relax_column_count: true,
    },
    dataReader: challengeReader,
    dataReaderParams: {
      challengeTypes
    },
  });
}

function createCustomParticipantReader(season) {
  return new Reader({
    csvDirectory: path.join(__dirname, challengesCsvPath(season)),
    parserOptions: {
      ltrim: true,
      relax_column_count: true,
    },
    dataReader: participantReader,
    dataReaderParams: {
      challengeTypes
    }
  });
}

async function purgeCollection(name) {
  return mongoose.connection.dropCollection(name).catch(e => {
    if (e.message !== 'ns not found') {
      console.log(e.message);
    }
  });
}

async function seedDatabase() {
  // purge all the things
  await purgeCollection('seasons');
  await purgeCollection('contestants');
  await purgeCollection('episodes');
  await purgeCollection('judges');
  await purgeCollection('challenges');
  await purgeCollection('participants');

  console.log('\nAll previous collections have been purged\n');

  // Get going
  const maxSeason = 2;

  await createSeasons(maxSeason);
}

seedDatabase();
