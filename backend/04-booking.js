'use strict';

const { Booking } = require('./db/models');

let options = {};
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;  // define your schema in options object
}
module.exports = {
    async up(queryInterface, Sequelize) {
        await Booking.bulkCreate([
            {
                spotId: 1,
                userId: 1,
                startDate: '2025-01-10',
                endDate: '2025-01-15'
            }, {
                spotId: 2,
                userId: 2,
                startDate: '2024-02-11',
                endDate: '2024-02-15'
            }, {
                spotId: 3,
                userId: 3,
                startDate: '2023-03-09',
                endDate: '2023-03-15'
            }, {
                spotId: 4,
                userId: 1,
                startDate: '2023-04-20',
                endDate: '2023-04-25'
            }, {
                spotId: 5,
                userId: 2,
                startDate: '2022-05-30',
                endDate: '2022-06-04'
            },

        ], { validate: true });


    },

    async down(queryInterface, Sequelize) {
        options.tableName = 'Bookings';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
        }, {});
    }
};
