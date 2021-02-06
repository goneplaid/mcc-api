const assert = require('assert');
const {
  describe, it
} = require('mocha');
const { AssertionError } = assert;
const CsvReader = require('../../../db/seed/csv-reader');
const SampleSerializer = require('./sample-serializer');
const path = require('path');

describe('db/seed', function () {
  describe('CsvReader class', function () {
    it('throws an error if you do not pass a serializer or a custom reader function', function (done) {
      try {
        new CsvReader({});

        assert.fail('expected exception not thrown');
      } catch (e) {
        if (e instanceof AssertionError) {
          throw e;
        }

        assert.strictEqual(e.message, 'You must pass a Serializer or a custom dataReader!');

        done();
      }
    });

    it('sets proper defaults in the constructor', function () {
      const reader = new CsvReader({
        season: '1',
        serializer: SampleSerializer,
        csvDirectory: path.join(__dirname, './sample.csv'),
      });

      assert.ok(reader.csvDirectory.includes('mcc-api/test/db/seed/sample.csv'), 'csvDirectory is set');
      assert.strictEqual(reader.parserOptions.delimiter, ':', 'delimeter is set');
      assert.strictEqual(reader.season, '1', 'sets the season');
    });

    describe('when using the default serializer', function () {
      it('reads records from the csv file when provided a serializer', function () {
        const reader = new CsvReader({
          season: '1',
          serializer: SampleSerializer,
          csvDirectory: path.join(__dirname, './sample.csv'),
        });

        const records = reader.read();

        assert.strictEqual(records.length, 5);
        assert.strictEqual(records[0].name, 'Aarón Sanchez');
        assert.deepStrictEqual(records[0].seasonNumbers, ['8', '9', '10']);
        assert.strictEqual(records[2].name, 'Graham Elliot');
        assert.deepStrictEqual(records[2].seasonNumbers, ['1', '2', '3', '4', '5', '6']);
      });
    });
  });
});
