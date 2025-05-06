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


// edit a Booking
router.put('/:bookingId', requireAuth, validBooking, async (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const { bookingId } = req.params;
    const userId = req.user.id;

    //Find the booking
    const booking = await Booking.findByPk(bookingId);

    // check if booking exists
    if (!booking) {
      const err = new Error("Booking was not found");
      err.status = 404;
      return next(err);
    }

    // does booking belong to user?
    if (booking.userId !== userId) {
      const err = new Error("Forbidden: You need permission to edit this booking");
      err.status = 403;
      return next(err);
    }
    // check, is booking date in the passed?
    const currDate = new Date();
    if (new Date(booking.endDate) < currDate) {
      const err = new Error("Past bookings cannot be modified");
      err.status = 403;
      return next(err);
    }

    // Booking conflict check
    const bookingConflictions = await Booking.findAll({
      where: {
        spotId: booking.spotId,
        id: { [Op.ne]: bookingId }, // this should exclude current booking
        [Op.or]: [
          // new start date falls within existing booking
          {
            startDate: { [Op.lte]: new Date(startDate) },
            endDate: { [Op.gte]: new Date(startDate) }
          },
          // new end date falls withing existing booking
          {
            startDate: { [Op.lte]: new Date(endDate) },
            endDate: { [Op.gte]: new Date(endDate) }
          },
          // existing  booking contained by new booking
          {
            startDate: { [Op.gte]: new Date(startDate) },
            endDate: { [Op.lte]: new Date(endDate) }
          }
        ]
      }
    });

    if (bookingConflictions.length > 0) {
      const err = new Error(" Sorry these dates have already been booked for this spot");
      err.status = 403;
      err.errors = {
        startDate: "start date conflicts with an existing booking",
        endDate: " End date conflicts with an existing booking"
      };
      return next(err);
    }
    //  update a booking
    const updateBooking = await booking.update({
      startDate,
      endDate
    });
    return res.json(updateBooking);
  } catch (error) {
    next(error);
  }
});



// Complete route /api/bookings/:bookingId
// Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // search for booking
    const booking = await Booking.findByPk(bookingId, {
      include: {
        model: Spot,
        attributes: ["ownerId"]
      }
    });

    //404 if not found
    if (!booking) {
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
    }
    // to delete booking  one must be the booking or spot owner?
    const isBookingOwner = booking.userId === userId;
    const isSpotOwner = booking.Spot && booking.Spot.ownerId === userId;

    if (!isBookingOwner && !isSpotOwner) {
      const err = new Error("Forbidden");
      err.status = 403;
      return next(err);
    }
    // Cant delete if booking has started
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingStart = new Date(booking.startDate);
    if (bookingStart <= today) {
      const err = new Error("This booking has started and cannot be deleted");
      err.status = 403;
      return next(err);
    }
    // the pretty way of cant delete booking if started 
    // const today = newDate();
    // if (newDate(booking.startDate) <= today ) {
    //   return res.status(403).json({message: "This booking has started and cannot be deleted"});
    // }

    // Delete and respond
    await booking.destroy();
    return res.json({ message: "Successfully deleted" });

  } catch (error) {
    next(error); // Error handling stuff in the app.js
  }
});

module.exports = router;