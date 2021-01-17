const Serializer = require('../util/serializer');
const AVATAR_PATH = '/assets/images/contestants/';

class ContestantSerializer extends Serializer {
  constructor(data, season) {
    super(data, [
      'name',
      'age',
      'hometown',
      'occupation',
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(/ /g, "_");
    const avatar = `${AVATAR_PATH}season_${season}/${camelizedName}.jpg`;

    this.avatar = avatar;
    this.season = season;
  }

  serialize() {
    return {
      name: this.name,
      age: this.age,
      hometown: this.hometown,
      occupation: this.occupation,
      avatar: this.avatar,
    };
  }
}

module.exports = ContestantSerializer;
