'use strict';

const { ReviewImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await ReviewImage.bulkCreate([
            {
                url: "https://reviewImage1",
                reviewId: 1
            },
            {
                url: "reviewImage2",
                reviewId: 4
            },
            {
                url: "https://reviewImage3",
                reviewId: 3
            },
            {
                url: "https://reviewImage4",
                reviewId: 5
            },
            {
                url: "https://reviewImage5",
                reviewId: 2
            },

        ], { validate: true });
    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'ReviewImages';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
        }, {});
    }
};
