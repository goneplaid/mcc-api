const mongoose = require('mongoose');
const Serializer = require('../util/serializer');

const ObjectId = mongoose.Types.ObjectId;
const AVATAR_PATH = '/assets/images/avatars/judges';

class JudgeSerializer extends Serializer {
  constructor(data) {
    super(data, {
      name: 0,
      seasons: 1,
    });

    this.id = new ObjectId;
    this.seasons = this.seasons.split(',');
    this.seasonIds = [];

    const sanitizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatar = `${AVATAR_PATH}/${sanitizedName}.png`;

    this.avatar = avatar;
  }

  serialize() {
    return {
      _id: this.id,
      name: this.name,
      avatar: this.avatar,
      season_ids: this.seasonIds,
    };
  }
}

module.exports = JudgeSerializer;
