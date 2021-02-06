const Serializer = require('../../../db/seed/pojo-serializer');
const { API_URL } = require('../../../config/site.json');

const AVATAR_URI = `${API_URL}/assets/images/judges`;

class SampleSerializer extends Serializer {
  constructor(data) {
    super(data, [
      'name',
      'seasonNumbers'
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatar = `${AVATAR_URI}/${camelizedName}.png`;

    this.avatar = avatar;
    this.seasonNumbers = this.seasonNumbers.split(',');
  }

  serialize() {
    return {
      name: this.name,
      avatar: this.avatar,
      seasonNumbers: this.seasonNumbers,
    };
  }
}

module.exports = SampleSerializer;
