'use strict';

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: "123 Kamehameha highway",
        city: "Honolulu",
        state: "Hawaii",
        country: "usa",
        lat: 37.76453,
        lng: -122.47303,
        name: "North Shore Paradise",
        description: "Come relax on the country side of hawaii. enjoy the beutiful island and all it treasures",
        price: 55.00
      },
      {
        ownerId: 1,
        address: "555 vscode st",
        city: "bikini top",
        state: "alaska",
        country: "usa",
        lat: 35.76463,
        lng: -120.77303,
        name: "code editor",
        description: "Best place to code",
        price: 90.00
      },
      {
        ownerId: 2,
        address: "group 3 apt 1",
        city: "New York City",
        state: "New York",
        country: "usa",
        lat: 31.76463,
        lng: -128.77303,
        name: "A cool group",
        description: "A place where people have fun",
        price: 69.00
      }, {
        ownerId: 3,
        address: "group 1 apt 3",
        city: "Buffalo",
        state: "New York",
        country: "usa",
        lat: 35.76463,
        lng: -120.77303,
        name: "A cold group",
        description: "Come here if you want to enjoy snow",
        price: 56.00
      }, {
        ownerId: 3,
        address: "group 8 apt 5",
        city: "Concrete Jungle",
        state: "New York",
        country: "usa",
        lat: 35.22463,
        lng: -127.33303,
        name: "Santa's hood",
        description: "Heaven is a place on Earth",
        price: 40.00
      },
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
    }, {});
  }
};
