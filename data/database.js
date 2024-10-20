const dotenv = require("dotenv");
dotenv.config();

const mongoClient = require('mongodb').MongoClient;

let database;

const initDb = callback => {
  if (database) {
    console.log('Database is already initialized!');
    return callback(null, database);
  }
  mongoClient.connect(process.env.DB_URI)
    .then(data => {
      database = data;
      console.log("Database conection successfull");
      callback(null, database);
    })
    .catch(err => {
      callback(err);
    });
};

const getDb = () => {
  if (!database) {
    throw Error('Database not initialized');
  }
  return database;
};

module.exports = {
  initDb,
  getDb
};