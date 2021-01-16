const mongoose = require('mongoose');
const config = require('config');

module.exports = async function connectDb() {
  console.log('connecting to database...');

  await mongoose.connect(config.database.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
}
