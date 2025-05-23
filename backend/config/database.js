// backend/config/database.js
const config = require('./index');

const db = config.db;
// const username = db.username;
// const password = db.password;
// const database = db.database;
// const host = db.host;
const schema = db.schema


module.exports = {
  development: {
    // username,
    // password,
    // database,
    // host,
    storage: process.env.DB_FILE || 'db/dev.db',
    dialect: 'sqlite',
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
    //logging: console.log
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    define: {
      schema: process.env.SCHEMA
    }
  }
};
