const PojoSerializer = require('../pojo-serializer');
const { API_URL } = require('../../../config/site.json');

const AVATAR_URI = `${API_URL}/assets/images/judges`;

class JudgeSerializer extends PojoSerializer {
  constructor(data) {
    // Attribute names + order in CSV file
    super(data, [
      'name',
      'seasonNumbers'
    ]);

    const camelizedName = this.name.toLowerCase().replace("'", '').replace(' ', '_');
    const avatar = `${AVATAR_URI}/${camelizedName}.png`;

    this.avatar = avatar;
  }

  serialize() {
    // Everything that will be exported to the database
    return {
      name: this.name,
      avatar: this.avatar,
      seasonNumbers: this.seasonNumbers,
    };
  }
}

module.exports = JudgeSerializer;
