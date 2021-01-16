
function relateSeasonToContestants(seasonRecord, contestantRecords) {
  if (!seasonRecord) throw new Error('seasonRecord is undefined!');
  if (!contestantRecords.length) throw new Error('contestantRecords is undefined!');

  for (const contestant of contestantRecords) {
    seasonRecord.contestantIds.push(contestant.id);
    contestant.seasonId = seasonRecord.id;
  }
}

function relateSeasonToEpisodes(seasonRecord, episodeRecords) {
  if (!seasonRecord) throw new Error('seasonRecord is undefined!');
  if (!episodeRecords.length) throw new Error('episodeRecords is undefined!');

  for (const episode of episodeRecords) {
    seasonRecord.episodeIds.push(episode.id);
    episode.seasonId = seasonRecord.id;
  }
}

function relateSeasonsToJudges(seasonRecords, judgeRecords) {
  if (!seasonRecords.length) throw new Error('seasonRecords is undefined!');
  if (!judgeRecords.length) throw new Error('judgeRecords is undefined!');

  for (const season of seasonRecords) {
    const judges = judgeRecords.filter(judge => judge.seasons.includes(season.number));

    season.judgeIds = (judges.map(judge => judge.id));
    judges.forEach(judge => judge.seasonIds.push(season.id));
  }
}

function relateChallengesToEpisodes(challengeRecords, episodeRecords) {
  if (!challengeRecords.length) throw new Error('challengeRecords is undefined!');
  if (!episodeRecords.length) throw new Error('episodeRecords is undefined!');

  for (const challenge of challengeRecords) {
    const episode = episodeRecords.find(episode => episode.number === challenge.episodeNumber);

    if (!episode) throw new Error('Episode for challenge not found!');

    episode.challengeIds.push(challenge.id);
    challenge.episodeId = episode.id;
  }
}

function relateParticipantsToContestants(participantRecords, contestantRecords) {
  if (!participantRecords.length) throw new Error('participantRecords is undefined!');
  if (!contestantRecords.length) throw new Error('contestantRecords is undefined!');

  for (const participant of participantRecords) {
    if (participant.challengeType === 'Team Challenge') {
      const challengeContestants = [];

      for (contestantName of participant.contestants) {
        const contestant = contestantRecords.find(contestant => contestant.name === contestantName);

        challengeContestants.push(contestant);
        contestant.participantIds.push(participant.id);
      }

      if (challengeContestants.length != participant.contestants.length) {
        throw new Error('One or more contestants were not found!');
      }

      participant.contestantIds = challengeContestants.map(contestant => contestant.id);
    } else {
      const contestant = contestantRecords.find(contestant => contestant.name === participant.contestants);

      participant.contestantIds = [contestant.id];
      contestant.participantIds.push(participant.id);

      if (!participant.contestantIds.length) {
        throw new Error('A contestant was not found!');
      }
    }
  }
}

function relateParticipantsToChallenges(participants, challenges, episodes) {
  if (!participants.length) throw new Error('participants is undefined!');
  if (!challenges.length) throw new Error('challenges is undefined!');
  if (!episodes.length) throw new Error('episodes is undefined!');

  for (challenge of challenges) {
    const challengeParticipants = participants.filter((participant) => {
      return participant.episodeNumber === challenge.episodeNumber && participant.challengeType == challenge.type;
    });

    if (!challengeParticipants.length) throw new Error('No matching participants for challenge!');

    challengeParticipants.forEach(participant => participant.challengeId = challenge.id);
    challenge.participantIds = challengeParticipants.map(participant => participant.id);
  }
}

function relateEliminationsToContestants(contestants, participants) {

}

module.exports = {
  relateSeasonToContestants,
  relateSeasonToEpisodes,
  relateSeasonsToJudges,
  relateChallengesToEpisodes,
  relateParticipantsToContestants,
  relateParticipantsToChallenges,
  relateEliminationsToContestants,
}
