/*
  PojoSerializer.js

  This simple class is meant to be used in conjunction with the CsvReader
  class to proceess and hydrate simple POJO objects from array data.

  Consumers of this class simply need to setup an array of sequential
  property names that correspond to the order of fields in data arrays
  passed to this class.

  The serialize() fuction must be overridden. Consumers must define what
  the shape of the final serialized object should look like.
*/

class PojoSerializer {
  constructor(data, keys) {
    for (let key of keys) {
      this[key] = data[keys.indexOf(key)];
    }
  }

  serialize() {
    throw new Error('you must implement the `serialize` function!');
  }
}

module.exports = PojoSerializer
