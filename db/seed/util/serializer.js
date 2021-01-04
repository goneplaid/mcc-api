class Serializer {
  constructor(data, keyMap) {
    Object.keys(keyMap).forEach((key) => {
      this[key] = data[keyMap[key]];
    })
  }

  serialize() {
    throw new Error('you must implement the `serialize` function!');
  }
}

module.exports = Serializer
