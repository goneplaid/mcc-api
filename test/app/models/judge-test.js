const assert = require('assert');
const {
  describe, it
} = require('mocha');
const judgeModel = require('../../../app/models/judge');

describe('app/models', function () {
  let judgeData;

  beforeEach(function () {
    judgeData = {
      name: 'Gordon Ramsay',
      avatar: 'gordon_ramsay',
    };
  });

  describe('Judge model', function () {
    it('can be instantiated', function (done) {
      const judge = new judgeModel(judgeData);

      assert.ok(judge.isNew);
      assert.strictEqual(judge.name, 'Gordon Ramsay');
      assert.strictEqual(judge.avatar, 'gordon_ramsay');

      done();
    });
    it('requires a name to be set', function (done) {
      delete judgeData.name;

      const judge = new judgeModel(judgeData);

      judge.validate(error => {
        assert.ok(error.message.includes('Path `name` is required'));

        done();
      });
    });
    it('requires an avatar to be set', function (done) {
      delete judgeData.avatar;

      const judge = new judgeModel(judgeData);

      judge.validate(error => {
        assert.ok(error.message.includes('Path `avatar` is required'));

        done();
      });
    });
  });
});
