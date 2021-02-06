const fs = require('fs');
const csvParseSync = require('csv-parse/lib/sync');

class CsvReader {
  constructor(options) {
    this.Serializer = options.serializer;
    this.customReader = options.dataReader;

    if (!(this.Serializer || this.customReader)) {
      throw new Error('You must pass a Serializer or a custom dataReader!');
    }

    this.dataReaderParams = options.dataReaderParams
    this.csvDirectory = options.csvDirectory;
    this.parserOptions = options.parserOptions || {};
    this.parserOptions.delimiter = ':';
    this.season = options.season;
  }

  readFile(csvDirectory) {
    return fs.readFileSync(csvDirectory);
  }

  parseCsv(file, parserOptions) {
    return csvParseSync(file, parserOptions);
  }

  read() {
    const file = this.readFile(this.csvDirectory);
    const data = this.parseCsv(file, this.parserOptions);
    let records = [];

    if (this.customReader) {
      records = this.customReader(data, this.dataReaderParams);
    } else {
      for (const row of data) {
        records.push(new this.Serializer(row, this.season));
      }
    }

    return records;
  }
}

module.exports = CsvReader;
