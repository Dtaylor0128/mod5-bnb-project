const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, User, SpotImage, Booking, Review, ReviewImage } = require('../../db/models');


// Validate Spots
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitud must be within -90 and 90.'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude must be within -180 and 180.'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day must be a positive number.'),
  handleValidationErrors
];



// Validation middleware for review data
// TODO: Do this validation
const validateReview = [
];

// --Get All spots--
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll({
      attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "description", "price", "createdAt", "updatedAt"],
      include: [
        { model: Review },
        {
          model: SpotImage,
          where: {
            preview: true
          }
        }
      ]
    });

    const prettySpots = [];

    for (let spot of spots) {
      const spotObj = await spot.toJSON();
      //console.log(spotObj)
      // gett the average of all the reviews per spot
      let sum = 0;
      for (let i = 0; i < spotObj.Reviews.length; i++) {
        let review = spotObj.Reviews[i];
        //console.log(review);
        sum += review.stars;
      }
      const avgRating = sum / spotObj.Reviews.length;
      spotObj.avgRating = avgRating;

      // Get the previewImage
      let previewImageUrl = null;
      for (let previewImage of spotObj.SpotImages) {
        if (previewImage.preview === true) {
          previewImageUrl = previewImage.url;
        }
      }

      spotObj.previewImage = previewImageUrl;
      delete spotObj.SpotImages;
      delete spotObj.Reviews
      prettySpots.push(spotObj)

    }

    return res.json({ Spots: prettySpots });
  } catch (e) {
    next(e);
  }
});


//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  try {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    //console.log(address, city, state, country, lat, lng, name, description, price)

    const newSpot = await Spot.create({
      ownerId: req.user.id,
      address, city, state, country, lat, lng, name, description, price
    });

    res.status(201);
    return res.json(newSpot);

  } catch (e) {
    next(e);
  }
});


// Get All spots --- dont worry about queries and pagination
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll();
    return res.json(spots);
  } catch (error) {
    next(error);
  }
});


// Get Spot by id
router.get('/:id', async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.id,
      {
        include: [
          {
            model: User,
            as: 'Owner',
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
    }

    return res.json(spot);
  } catch (error) {
    next(error);
  }
});




// Get spots by owner id
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    // TODO: add validations and error handling to this route

    const ownerId = req.user.id;
    const spot = await Spot.findAll({
      where: {
        ownerId: parseInt(ownerId)
      },
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
      ]
    });

    if (!spot) {
      let noExistingSpotError = new Error("Spot couldn't be found");
      noExistingSpotError.status = 404;
      throw noExistingSpotError;
    }

    if (Spot.userId !== ownerId) {
      let notUserSpotError = new Error(" This is not your spot");
      notUserSpotError.status = 403;
      throw notUserSpotError;
    }

    return res.status(200).json(spot);
  } catch (error) {
    next(error);
  }
});


// Add a Spot Image to an existing Spot based on Spot ID (user auth required)
router.post('/:id/images', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.id;
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(spotId);
    if (spot !== null) {
      const invalidSpotId = new Error("Spot couldn't be found");
      invalidSpotId.status = 404;
      throw invalidSpotId;
    }
    const newImage = await SpotImage.create({
      spotId: parseInt(spotId),
      url,
      preview,
    });
    return res.status(201).json(newImage);
  } catch (error) {
    next(error);
  }
});

// Edit a spot
// Complete route /api/spots/:spotId
router.put('/:id', requireAuth, validateSpot, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingSpot = await Spot.findByPk(id);
    if (!existingSpot) {
      const error = new Error("Spot couldn't be found");
      error.status = 404;
      throw error;
    }

    if (existingSpot.ownerId !== userId) {
      const error = new Error("Forbidden");
      error.status = 403;
      throw error;
    }

    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    existingSpot.address = address;
    existingSpot.city = city;
    existingSpot.state = state;
    existingSpot.country = country;
    existingSpot.lat = lat;
    existingSpot.lng = lng;
    existingSpot.name = name;
    existingSpot.description = description;
    existingSpot.price = price;

    await existingSpot.save();

    return res.status(200).json(existingSpot);
  } catch (error) {
    next(error);
  }
});



// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const userId = req.user.id;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      throw err;
    }

    if (spot.ownerId !== userId) {
      const err = new Error('Forbidden');
      err.status = 403;
      throw err;
    }

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
  } catch (e) {
    next(e);
  }
});



// Creating a Review based on a spot id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
  try {
    // How do I grab the spot id that was used on postman
    // req.paramgs is an object of parameters
    // This is one way to grab it
    // const spotId = req.params.spotId
    const { spotId } = req.params;
    const userId = req.user.id;
    const { review, stars } = req.body;

    // Find out if the spot exists
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      let noResourceError = new Error("Spot couldn't be found");
      noResourceError.status = 404;
      throw noResourceError;
    }

    // If it does exist -> See if the current user made a review already]
    const userReview = await Review.findOne({
      where: {
        userId: userId
      }
    });

    // if userReview is null -> we did not make a review already
    if (!userReview) {
      // Create the new Review
      const newReview = await Review.create({ userId, spotId, review, stars });
      res.status(200);
      return res.json(newReview);
    } else {
      // TODO: Edit this error message and status code based on api docs
      let alreadyReviewedError = new Error("User already has a review for this spot");
      alreadyReviewedError.status = 500;
      throw alreadyReviewedError;
    }

  } catch (error) {
    next(error);
  }
})



// Get all reviews belonging to a spot based on spot id
router.get('/:id/reviews', async (req, res, next) => {
  try {

    const spotId = req.params.id;

    // Find the spot
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      const noResourceError = new Error("Spot couldn't be found");
      noResourceError.status = 404;
      throw noResourceError;
    }

    // SEQUELIZE ---- GRABBING DATA FROM THE DATABASE -> crosses the bridge -> DATABASE
    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"]

        },
        {
          model: ReviewImage,
          attributes: ["id", "reviewId", "url"]
        }
      ]
    });

    res.status(201);
    return res.json({ Reviews: reviews });
    // return res.json({Reviews: prettyReviews});
  } catch (error) {
    //console.log("starting point")
    next(error);
  }
})

module.exports = router;




// --------------- THIS IS HOW WE GET QUERIES USING JAVASCRIPT ------
// NOT VERY EFFICIENT IN TERMS OF PERFORMANCE, BUT GREAT FOR SMALL PROJECTS AND SPRINTS
// const resReviews = [];

// // Loop through all the reviews
// for(let review of reviews){
//   // Method to turn ugly sequelize objects into pretty javascript objrects
//   const prettyReview = await review.toJSON();
//   // console.log("This is one singular review", prettyReview)
//   // Grab the id from the prettyReview object and use it to get the User associated to that id
//   let userId = prettyReview.userId;
//   const userObj = await User.findByPk(userId);
//   const prettyUser = await userObj.toJSON();
//   // console.log(prettyUser, "this is the user who made the review");
//   prettyReview["User"] = prettyUser
//   resReviews.push(prettyReview);
//   // console.log("This is one singular review", prettyReview)
// }


// TODO
// - GET RID OF THE USERNAME FROM THE RETURN
// - GET RID OF THE REVIEWID
// - GET RID OF THE CREATEDAT AND UPDATEDAT


/*
 "Reviews": [
    {
      "id": 1, ---
      "userId": 1, ---
      "spotId": 1, ---
      "review": "This was an awesome spot!", ----
      "stars": 5, ----
      "createdAt": "2021-11-19 20:39:36", ----
      "updatedAt": "2021-11-19 20:39:36", -----
      "User": { ---
        "id": 1, ---
        "firstName": "John", ---
        "lastName": "Smith" ---
      },
      "ReviewImages": [ --
        {
          "id": 1, ---
          "url": "image url" ---
        }
      ],
    }
  ]

*/

// ---------- CLEAN UP EACH REVIEW USING JAVASCRIPT ------------
// let prettyReviews = [];

// for(let review of reviews){
//   // Make the review a javascript object
//   const prettyReview = review.toJSON();
//   // delete the username from the User object
//   delete prettyReview.User.username

//   // add all the reviewImage objects we want to keep into this array
//   const prettyReviewImages = [];

//   // loop through each ReviewImages and delete them
//   for(let reviewImage of prettyReview.ReviewImages){
//     // delete the createdAt key from each reviewImage
//     delete reviewImage.createdAt;
//     // delete the updatedAt keyt from each reviewImage
//     delete reviewImage.updatedAt;
//     // Add our reviewImage (modified) to our storage array on line 148
//     prettyReviewImages.push(reviewImage);

//   }
//   // reassign the key-value of our reviewImages with the pretty version
//   prettyReview.ReviewImages = prettyReviewImages;
//   // Push all our pretty reviews into our tracker on line 139
//   prettyReviews.push(prettyReview);
// }
