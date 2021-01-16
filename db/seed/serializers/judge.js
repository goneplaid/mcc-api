const Serializer = require('../util/serializer');
const AVATAR_PATH = '/assets/images/avatars/judges';

class JudgeSerializer extends Serializer {
  constructor(data) {
    super(data, [
      'name',
      'seasons'
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatar = `${AVATAR_PATH}/${camelizedName}.png`;

    this.avatar = avatar;
    this.seasonNumbers = this.seasons.split(',');
  }

  serialize() {
    return {
      name: this.name,
      avatar: this.avatar,
      seasonNumbers: this.seasonNumbers,
    };
  }
}

module.exports = JudgeSerializer;
