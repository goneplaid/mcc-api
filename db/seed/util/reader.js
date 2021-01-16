const fs = require('fs');
const csvParseSync = require('csv-parse/lib/sync');

class Reader {
  constructor(options) {
    this.records = [];

    const csvDirectory = options.csvDirectory;
    const Serializer = options.serializer;
    const customReader = options.dataReader;
    const file = fs.readFileSync(csvDirectory);
    const parserOptions = options.parserOptions || {};

    parserOptions.delimiter = ':';

    const data = csvParseSync(file, parserOptions);

    if (!(Serializer || customReader)) throw new Error('You must pass a Serializer or a custom dataReader!');

    if (customReader) {
      this.records = customReader(data, options.dataReaderParams);
    } else {
      for (const row of data) {
        this.records.push(new Serializer(row, options.season));
      }
    }
  }
}

module.exports = Reader;
