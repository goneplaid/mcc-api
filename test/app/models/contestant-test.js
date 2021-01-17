const assert = require('assert');
const {
  describe, it, beforeEach
} = require('mocha');
const contestantModel = require('../../../app/models/contestant');

describe('app/models', function () {
  let contestantData;

  beforeEach(function () {
    contestantData = {
      name: 'Shawn Wilson',
      age: 40, // yikes
      hometown: 'Fresno, CA',
      occupation: 'Maker of thangs',
      avatar: 'image.png'
    };
  });

  describe('Contestant model', function () {
    it('can be instantiated', function (done) {
      const contestant = new contestantModel(contestantData);

      assert.ok(contestant.isNew);
      assert.strictEqual(contestant.name, 'Shawn Wilson');
      assert.strictEqual(contestant.age, 40);
      assert.strictEqual(contestant.hometown, 'Fresno, CA');
      assert.strictEqual(contestant.occupation, 'Maker of thangs');
      assert.strictEqual(contestant.avatar, 'image.png');

      done();
    });
    it('requires a name to be set', function (done) {
      delete contestantData.name;

      const contestant = new contestantModel(contestantData);

      contestant.validate(error => {
        assert.ok(error.message.includes('Path `name` is required'));

        done();
      });
    });
    it('requires an age to be set', function (done) {
      delete contestantData.age;

      const contestant = new contestantModel(contestantData);

      contestant.validate(error => {
        assert.ok(error.message.includes('Path `age` is required'));

        done();
      });
    });
    it('requires a hometown to be set', function (done) {
      delete contestantData.hometown;

      const contestant = new contestantModel(contestantData);

      contestant.validate(error => {
        assert.ok(error.message.includes('Path `hometown` is required'));

        done();
      });
    });
    it('requires an occupation to be set', function (done) {
      delete contestantData.occupation;

      const contestant = new contestantModel(contestantData);

      contestant.validate(error => {
        assert.ok(error.message.includes('Path `occupation` is required'));

        done();
      });
    });
    it('requires an avatar to be set', function (done) {
      delete contestantData.avatar;

      const contestant = new contestantModel(contestantData);

      contestant.validate(error => {
        assert.ok(error.message.includes('Path `avatar` is required'));

        done();
      });
    });
  });
});
