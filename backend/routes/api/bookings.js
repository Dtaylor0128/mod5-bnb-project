// --Imports--
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { check } = require('express-validator');
const { Op } = require('sequelize');


// --Sequelize Imports--
const { Booking, User, Spot, SpotImage } = require('../../db/models');
//const booking = require('../../db/models/booking');

// -- Validation Middleware for Booking
const validBooking = [
  check("startDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage("Start date must be a valid date, please try again")
    .custom(value => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value) < today) {
        throw new Error("Start date cannot be in the past, please try again");
      }
      return true;
    }),

  check("endDate")
    .exists({ checkFalsy: true })
    .isDate()
    .withMessage(" End date cannot be before or on start date, please try again")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("End date cannot be before or on start date, please try again");
      }
      return true;
    }),
  handleValidationErrors
];

// Complete route /api/bookings/current



// Get all of the Current User's Booking

// remember req, res, next allow for middleware chaining

router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { userId },
      //attributes: ["id", "spotId"],
      include: [
        {
          model: Spot,
          attributes: [
            "id", "ownerId", "address", "city", "state", "country",
            "lat", "lng", "name", "price"
          ],
          include: [
            {
              model: SpotImage,
              attributes: ["url"],
              where: { preview: true },
              required: false
            }
          ]
        }
      ]
    });

    // format response make it pretty/ match API specs
    const formattedBookings = bookings.map(booking => {
      const bookingData = booking.toJSON();
      //adding previewImage to Spot
      if (bookingData.Spot && bookingData.Spot.SpotImages && bookingData.Spot.SpotImages.length > 0) {
        bookingData.Spot.previewImage = bookingData.Spot.SpotImages[0].url;
      } else {
        bookingData.Spot.previewImage = null;
      }
      delete bookingData.Spot.SpotImages;
      return bookingData;
    });


    return res.json({ Bookings: formattedBookings });
  } catch (error) {
    next(error);
  }
});




// {
//   "Bookings": [
//     {
//       "id": 1, =========
//       "spotId": 1, =========
//       "Spot": { =========
//         "id": 1, =========
//         "ownerId": 1, =========
//         "address": "123 Disney Lane", =========
//         "city": "San Francisco", =========
//         "state": "California", =========
//         "country": "United States of America", =========
//         "lat": 37.7645358, =========
//         "lng": -122.4730327, =========
//         "name": "App Academy", =========
//         "price": 123, =========
//         "previewImage": "image url"
//       },
//       "userId": 2,
//       "startDate": "2021-11-19",
//       "endDate": "2021-11-20",
//       "createdAt": "2021-11-19 20:39:36",
//       "updatedAt": "2021-11-19 20:39:36"
//     }
//   ]
// }





// Complete route /api/bookings/:bookingId
// Edit a Booking
// router.put('/bookingId', async (req, res, next) => {
//   try {


//     return res.json(":)")

//   } catch (error) {
//     next(error);
//   }
// });














// Complete route /api/bookings/:bookingId
// Delete a Booking
// router.delete('/:bookingId', requireAuth, async (req, res, next) => {
//   try {
//       res.status(200);


//       return res.json({ message: ":)" });

//   } catch (error) {
//       next(error); // Error handling stuff in the app.js
//   }
// });

// Exports the route that will be used in the api.index.js
module.exports = router;