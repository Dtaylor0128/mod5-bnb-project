'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://spotImage1",
        preview: true
      },
      {
        spotId: 2,
        url: "https://spotImage2",
        preview: true
      },
      {
        spotId: 3,
        url: "https://spotImage3",
        preview: true
      },
      {
        spotId: 4,
        url: "https://spotImage4",
        preview: true
      },
      {
        spotId: 5,
        url: "https://spotImage5",
        preview: true
      },

    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
