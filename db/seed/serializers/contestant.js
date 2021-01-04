const mongoose = require('mongoose');
const Serializer = require('../util/serializer');

const ObjectId = mongoose.Types.ObjectId;
const AVATAR_PATH = '/assets/images/avatars/contestants/';

class ContestantSerializer extends Serializer {
  constructor(data, season) {
    super(data, {
      name: 0,
      age: 1,
      hometown: 2,
      occupation: 3,
    });

    this.id = new ObjectId;
    this.season = season;
    this.seasonId = null;
    this.participantIds = [];

    const sanitizedName = this.name.toLowerCase().replace("'", '').replace(/ /g, "_");
    const avatar = `${AVATAR_PATH}season_${season}/${sanitizedName}.jpg`;

    this.avatar = avatar;
  }

  serialize() {
    return {
      _id: this.id,
      name: this.name,
      age: this.age,
      hometown: this.hometown,
      occupation: this.occupation,
      avatar: this.avatar,
      season_id: this.seasonId,
      participant_ids: this.participantIds,
    };
  }
}

module.exports = ContestantSerializer;
