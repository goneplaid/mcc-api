const assert = require('assert');
const {
  describe, it, beforeEach
} = require('mocha');
const episodeModel = require('../../../app/models/episode');

describe('app/models', function () {
  let episodeData;

  beforeEach(function () {
    episodeData = {
      number: '7',
      name: 'The Cooks Cook Each Other',
      airDate: '1/1/11',
    };
  });

  describe('Episode model', function () {
    it('can be instantiated', function (done) {
      const episode = new episodeModel(episodeData);

      assert.ok(episode.isNew);
      assert.strictEqual(episode.number, '7');
      assert.strictEqual(episode.name, 'The Cooks Cook Each Other');
      assert.strictEqual(episode.airDate, '1/1/11');

      done();
    });
    it('requires a number to be set', function (done) {
      delete episodeData.number;

      const episode = new episodeModel(episodeData);

      episode.validate(error => {
        assert.ok(error.message.includes('Path `number` is required'));

        done();
      });
    });
    it('requires a name to be set', function (done) {
      delete episodeData.name;

      const episode = new episodeModel(episodeData);

      episode.validate(error => {
        assert.ok(error.message.includes('Path `name` is required'));

        done();
      });
    });
    it('requires an airDate to be set', function (done) {
      delete episodeData.airDate;

      const episode = new episodeModel(episodeData);

      episode.validate(error => {
        assert.ok(error.message.includes('Path `airDate` is required'));

        done();
      });
    });
  });
});
