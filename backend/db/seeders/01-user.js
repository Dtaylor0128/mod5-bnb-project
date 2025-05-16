'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await User.bulkCreate([
      {

        firstName: 'Leroy',
        lastName: 'Jenkins',
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'patrick',
        lastName: 'start',
        email: 'star@user.io',
        username: 'pstar',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'spongebob',
        lastName: 'squarepants',
        email: 'spongebob@user.io',
        username: 'spongebob123',
        hashedPassword: bcrypt.hashSync('password')
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
