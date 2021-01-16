/*
  Function: participantReader()

  Overview:

    This function takes challenge data, in the form of raw CSV data manually scraped from
    Wikipedia, and transforms it into Participant models for each challenge.

    It requires the CSV data, season, and Challenge models that have already been processed
    and serialized.

    The raw CSV data is kind of hard to work with but it is possible to pull out some meaningful
    information that we can work with for creating formalized models to further represent each
    challenge on MC in a given season.

  Purpose:

    The data that we're working with here will be used to create Participant models for each
    challenge. The Participant model is a useful abstraction that we can use to organize
    contestants on the show as participants in a given challenge, whether or not it's a team
    challenge or an individual one. It also gives us a logical place to store information on
    how participants fared in a given challenge, ie, was a contestant on a winning or losing team?
    Were they an individual top-3 finisher or did they finish in the bottom rung? These are all
    qualitative aspects of each challenge that we would like to quantify.

  Explanation of data used:

    Season 1 example

    Place:Contestant:   4:      4:      5:      5:      6:      6:      7:      7:      8:      8:      9:      9:      10:     10:     11:     11:      12:      12:       13
    1:Whitney Miller:   MB-WIN: ET-IN:  TC-LOS: PT-IN:  MB-HIGH:ET-IN:  TC-LOS: PT-IN:  MB-IN:  ET-LOW: TC-WIN: PT-IMM: MB-HIGH:ET-WIN: IC-LOW: PT-LOW:  SF-IMM:  SF-WIN:   F-WINNER
    2:David Miller:     MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  IC-WIN: PT-IMM:  SF-WIN:  SF-IMM:   F-RUNNER-UP
    3:Lee Knaz:         MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-WIN: ET-WIN: TC-LOS: PT-LOW: MB-IN:  ET-LOW: IC-HIGH:PT-IMM:  SF-IMM:  SF-ELIM:
    4:Sheetal Bhagat:   MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-HIGH:ET-LOW: TC-WIN: PT-IMM: MB-WIN: ET-LOW: IC-IN:  PT-IMM:  SF-ELIM:
    5:Sharone Hakman:   MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-WIN: ET-IMM: TC-WIN: PT-IMM: MB-HIGH:ET-IN:  TC-WIN: PT-IMM: MB-HIGH:ET-IN:  IC-LOW: PT-ELIM:
    6:Michael Kim:      MB-IN:  ET-WIN: TC-WIN: PT-IMM: MB-IN:  ET-LOW: TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-IN:  ET-ELIM:
    7:Jacob Gandolfo:   MB-HIGH:ET-IN:  TC-WIN: PT-IMM: MB-HIGH:ET-WIN: TC-LOS: PT-IN:  MB-IN:  ET-IN:  TC-LOS: PT-ELIM:
    7:Tracy Nailor:     MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-IN:  ET-LOW: TC-LOS: PT-ELIM:
    9:Kim Dung Huynh:   MB-IN:  ET-IN:  TC-LOS: PT-IN:  MB-IN:  ET-LOW: TC-WIN: PT-IMM: MB-IN:  ET-ELIM:
    10:Anthony Carbone: MB-IN:  ET-IN:  TC-WIN: PT-IMM: MB-IN:  ET-IN:  TC-LOS: PT-ELIM:
    11:Faruq Jenkins:   MB-IN:  ET-LOW: TC-LOS: PT-IN:  MB-IN:  ET-ELIM:
    12:Jenna Hamiter:   MB-IN:  ET-IN:  TC-LOS: PT-ELIM:
    13:Avis White:      MB-IN:  ET-ELIM:
    13:Sheena Zadeh:    MB-HIGH:ET-ELIM:

    The data that was scrapped from Wikipedia for each season consists of a large table containing
    the results of each challenge, what episodes they appeared in, codes to represent what type of
    challenges were performed, and finally how each participant fared in each challenge.

    The columns represent each episode + challenge. If a given episode featured two challenges,
    then there are two columns that share the same episode number.

    The rows represent each individual contestant, how they did in each challenge individually or
    if they were part of a losing or winning team.
*/
const zip = require('lodash.zip');
const ParticipantSerializer = require('../serializers/participant');

function participantReader(data, { challengeTypes }) {
  // The first thing we need to do is rotate the matrix of data. Since each row represents a
  // timeline of each individual contestant and how they performed across all episodes, it's hard
  // to work with as each contestant is isolated from other contestants in the same challenges.
  //
  // Instead, it's easier to work with each challenge individually along with all contestants that
  // participated in them rather than dealing with each contestant separately.
  const challenges = zip.apply(this, data);

  // Nuke the first row as it now contains each contestants finishing place, which we don't care
  // about for the purpose of this function.
  challenges.shift();

  // Remove the first row again but preserve it as a reference to each contestant's name
  const contestantNames = challenges.shift();

  // Also remove the first item, a header we don't need from prior to rotating
  contestantNames.shift();

  const participants = [];

  // Start processing all the thangs!
  for (const challenge of challenges) {
    // First, get the essentials
    const episodeNumber = challenge.shift();

    if (!challenge[0]) break; // empty set, end of challenges

    const typeCode = challenge[0].split('-')[0];
    const type = challengeTypes.find(type => type.code === typeCode);

    if (!type) throw new Error('challenge type not found!');

    const challengeType = type.name;
    const parseContestantResult = (contestantInfo) => contestantInfo.split('-')[1].toLowerCase();

    // If this is a team challenge then we simply want to create two participants, the winner
    // and the loser. Otherwise, for all other challenge types, we'll want to create one participant
    // per contestant.
    if (typeCode === 'TC') {
      const winners = []
      const losers = [];
      const participantType = 'team';

      // Gather up all of the contestants for this team challenge.
      for (const [index, contestantInfo] of challenge.entries()) {
        if (!contestantInfo) break;

        const result = parseContestantResult(contestantInfo);

        (result === 'win' ? winners : losers).push(contestantNames[index]);
      }

      participants.push(new ParticipantSerializer([
        episodeNumber,
        challengeType,
        participantType,
        winners,
        'win',
      ]));

      participants.push(new ParticipantSerializer([
        episodeNumber,
        challengeType,
        participantType,
        losers,
        'lose',
      ]));
    } else {
      for (const [index, contestantInfo] of challenge.entries()) {
        if (!contestantInfo) break;

        const participantType = 'individual';
        const result = parseContestantResult(contestantInfo);

        participants.push(new ParticipantSerializer([
          episodeNumber,
          challengeType,
          participantType,
          [contestantNames[index]],
          result,
        ]));
      }
    }
  }

  return participants;
}

module.exports = participantReader;
