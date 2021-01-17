const Serializer = require('../util/serializer');
const AVATAR_PATH = '/assets/images/judges';

class JudgeSerializer extends Serializer {
  constructor(data) {
    super(data, [
      'name',
      'seasonNumbers'
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatar = `${AVATAR_PATH}/${camelizedName}.png`;

    this.avatar = avatar;
  }

  serialize() {
    return {
      name: this.name,
      avatar: this.avatar,
    };
  }
}

module.exports = JudgeSerializer;
