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


// Complete route /api/bookings/current
// Get all of the Current User's Booking

router.get('/current', requireAuth, async (req, res, next) => {
  try {
    res.status(200);

    const userId = req.user.id;

    const bookings = await Booking.findAll({
      where: { userId },
      attributes: ["id", "spotId"],
      include: [
        {
          model: Spot,
          attributes: [
            "id", "ownerId", "address", "city", "state", "country",
            "lat", "lng", "name", "price"
          ]
        }
      ]
    });



    return res.json({Bookings: bookings});
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