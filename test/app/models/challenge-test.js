const assert = require('assert');
const {
  describe, it
} = require('mocha');
const challengeModel = require('../../../app/models/challenge');

describe('app/models', function () {
  describe('Challenge model', function () {
    it('can be instantiated', function (done) {
      const challenge = new challengeModel({ type: 'Bird Box Challenge' });

      assert.ok(challenge.isNew);
      assert.strictEqual(challenge.type, 'Bird Box Challenge');

      done();
    });
    it('requires a type to be set', function (done) {
      const challenge = new challengeModel();

      challenge.validate(error => {
        assert.ok(error.message.includes('Path `type` is required'));

        done();
      });
    });
  });
});
