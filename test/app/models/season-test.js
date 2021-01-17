const assert = require('assert');
const {
  describe, it
} = require('mocha');
const seasonModel = require('../../../app/models/season');

describe('app/models', function () {
  describe('Season model', function () {
    it('can be instantiated', function (done) {
      const season = new seasonModel({ number: '1' });

      assert.ok(season.isNew);
      assert.strictEqual(season.number, '1');

      done();
    });
    it('requires a number to be set', function (done) {
      const season = new seasonModel();

      season.validate(error => {
        assert.ok(error.message.includes('Path `number` is required'));

        done();
      });
    });
  });
});
