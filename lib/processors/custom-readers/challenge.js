const uuid = require('uuid/v4'); // for random uuid's
const ChallengeSerializer = require('../serializers/challenge');

function challengeReader(data, season, { challengeTypes }) {
  const episodeNumbers = data.shift().slice(2);
  const challengeData = data.shift().slice(2);

  return challengeData.map((challenge, index) => {
    const challengeTypeCode = challenge.split('-')[0];

    const id = uuid();
    const type = challengeTypes.find(type => type.code === challengeTypeCode);

    if (!type) throw new Error(`challenge type not found! episode: ${episodeNumbers[index]}, challengeData: ${challenge}`);

    return new ChallengeSerializer([id, type.name, episodeNumbers[index]]);
  });
}

module.exports = challengeReader;
