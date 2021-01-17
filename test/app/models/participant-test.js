const assert = require('assert');
const {
  describe, it, beforeEach
} = require('mocha');
const participantModel = require('../../../app/models/participant');

describe('app/models', function () {
  let participantData;

  beforeEach(function () {
    participantData = {
      name: 'Blue Team',
      type: 'team',
      result: 'win',
    };
  });

  describe('Participant model', function () {
    it('can be instantiated', function (done) {
      const participant = new participantModel(participantData);

      assert.ok(participant.isNew);
      assert.strictEqual(participant.name, 'Blue Team');
      assert.strictEqual(participant.type, 'team');
      assert.strictEqual(participant.result, 'win');

      done();
    });
    it("doesn't require a name to be set", function (done) {
      delete participantData.name;

      const participant = new participantModel(participantData);

      participant.validate(error => {
        assert.strictEqual(error, null);

        done();
      });
    });
    it("doesn't require a type to be set", function (done) {
      delete participantData.type;

      const participant = new participantModel(participantData);

      participant.validate(error => {
        assert.strictEqual(error, null);

        done();
      });
    });
    it('requires a result to be set', function (done) {
      delete participantData.result;

      const participant = new participantModel(participantData);

      participant.validate(error => {
        assert.ok(error.message.includes('Path `result` is required'));

        done();
      });
    });
  });
});
