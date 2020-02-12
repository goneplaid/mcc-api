const uuid = require('uuid/v4'); // for random uuid's
const Serializer = require('../util/serializer');

const AVATAR_PATH = '/assets/images/avatars/contestants/';

class ContestantSerializer extends Serializer {
  constructor(data, season) {
    super(data, {
      name: 0,
      age: 1,
      hometown: 2,
      occupation: 3,
    });

    this.id = uuid();
    this.season = season;
    this.seasonId = null;
    this.participantIds = [];

    const sanitizedName = this.name.toLowerCase().replace("'", '').replace(/ /g, "_");
    const avatar = `${AVATAR_PATH}season_${season}/${sanitizedName}.jpg`;

    this.avatar = avatar;
  }

  serialize() {
    return `
  {
    id: "${this.id}",
    name: "${this.name}",
    age: ${this.age},
    hometown: "${this.hometown}",
    occupation: "${this.occupation}",
    avatar: "${this.avatar}",
    seasonId: "${this.seasonId}",
    participantIds: ${JSON.stringify(this.participantIds)},
  }`;
  }
}

module.exports = ContestantSerializer;
