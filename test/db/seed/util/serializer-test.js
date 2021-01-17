const assert = require('assert');
const {
  describe, it
} = require('mocha');

const Serializer = require('../../../../db/seed/util/serializer');
const { AssertionError } = assert;

describe('db/seed/util', function () {
  describe('Serializer class', function () {
    class AndroidSerializer extends Serializer {
      constructor(data) {
        super(data, [
          'playedBy',
          'firstAppearance',
          'gender',
          'petName',
          'petSpecies'
        ]);
      }

      serialize() {
        return {
          playedBy: this.playedBy,
          firstAppearance: this.firstAppearance,
          gender: this.gender,
        };
      }
    }

    const dataData = [
      'Brent Spiner',
      'Encounter at Fairpoint',
      'male',
      'Spot',
      'feline'
    ];

    describe('constructor', function () {
      it('defines and sets properties on instantiation', function (done) {
        const dataSerializer = new AndroidSerializer(dataData);

        // Has these properties
        assert.ok(Reflect.has(dataSerializer, 'playedBy'));
        assert.ok(Reflect.has(dataSerializer, 'firstAppearance'));
        assert.ok(Reflect.has(dataSerializer, 'gender'));
        assert.ok(Reflect.has(dataSerializer, 'petName'));
        assert.ok(Reflect.has(dataSerializer, 'petSpecies'));

        // Has this data
        assert.strictEqual(dataSerializer.playedBy, dataData[0]);
        assert.strictEqual(dataSerializer.firstAppearance, dataData[1]);
        assert.strictEqual(dataSerializer.gender, dataData[2]);
        assert.strictEqual(dataSerializer.petName, dataData[3]);
        assert.strictEqual(dataSerializer.petSpecies, dataData[4]);

        done();
      });
    });

    describe('serialize() method', function () {
      it('serializes and returns a custom POJO', function (done) {
        const dataSerializer = new AndroidSerializer(dataData);
        const customPojo = dataSerializer.serialize();

        // Has these properties
        assert.ok(Reflect.has(customPojo, 'playedBy'));
        assert.ok(Reflect.has(customPojo, 'firstAppearance'));
        assert.ok(Reflect.has(customPojo, 'gender'));

        // Doesn't have these
        assert.strictEqual(!Reflect.has(dataSerializer, 'petName'), false);
        assert.strictEqual(!Reflect.has(dataSerializer, 'petSpecies'), false);

        done();
      });

      it('requires you to define a custom serialize() method', function (done) {
        // Kudo's to this post for showing how to properly catch an error
        // w/ assert in NodeJS: https://medium.com/adobetech/testing-error-handling-in-node-js-567323397114
        class BrokenSerializer extends Serializer {
          constructor(data) {
            super(data, ['nope']);
          }
        }

        const oops = new BrokenSerializer(['omg']);

        try {
          oops.serialize();

          assert.fail('expected exception not thrown');
        } catch (e) {
          if (e instanceof AssertionError) {
            throw e;
          }

          assert.strictEqual(e.message, 'you must implement the `serialize` function!');

          done();
        }
      });
    });
  });
});
