'use strict';
const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        userId: 1,
        spotId: 1,
        review: 'Such a lovely place to stay at',
        stars: 5,
      },
      {
        userId: 2,
        spotId: 2,
        review: 'had fun staying at this place',
        stars: 4,
      }, {
        userId: 3,
        spotId: 3,
        review: 'dificult to find a parking spot but enjoyed the stay',
        stars: 3,
      }, {
        userId: 1,
        spotId: 4,
        review: 'the heat was not working, do not recommend!!',
        stars: 2,
      }, {
        userId: 2,
        spotId: 5,
        review: 'got to create so many memories with my family, will definitely come back',
        stars: 5,
      }, {
        userId: 3,
        spotId: 5,
        review: 'the owner did not cooperate at all, were up all night in cold',
        stars: 1,
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {

    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
