const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../utils/auth');
const { check, validationResult } = require('express-validator');
const { Spot, Review, User, ReviewImage, SpotImage } = require('../../db/models');
const { handleValidationErrors } = require('../../utils/validation');




// Validation middleware for review data
// TODO: Do this validation
const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Starts must be an integer from 1 to 5'),
  handleValidationErrors
];

// Add a Review Image to an existing Review based on Review Id (user auth required)
router.post('/:id/images', requireAuth, async (req, res, next) => {
  try {
    // TODO: Do this route

    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
      let noExistingReviewError = new Error("Review couldn't be found");
      noExistingReviewError.status = 404;
      throw noExistingReviewError;
    }

    if (review.userId !== userId) {
      let notUserReviewError = new Error(" This is not your review");
      notUserReviewError.status = 403;
      throw notUserReviewError;
    }

    const reviewImageCount = await ReviewImage.count({
      where: {
        reviewId
      }
    });

    if (reviewImageCount >= 10) {
      let tooManyReviewImages = new Error("Maximum number of images for this resource was reached");
      tooManyReviewImages.status = 403;
      throw tooManyReviewImages;
    }

    const newImage = await ReviewImage.create({
      reviewId,
      url
    });

    return res.status(201).json(newImage);
  } catch (e) {
    next(e);
  }
});

// Route to get all reviews written by the current user
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [
            {
              model: SpotImage,
              attributes: ['url'],
              where: { preview: true },
              required: false
            }
          ]
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    // Formatting the reviews to make it pretty
    const formattedReviews = reviews.map(review => {
      const reviewData = review.toJSON();
      if (reviewData.Spot && reviewData.Spot.SpotImages && reviewData.Spot.SpotImages.length > 0) {
        reviewData.Spot.previewImage = reviewData.Spot.SpotImages[0].url;
      } else {
        reviewData.Spot.previewImage = null;
      }
      delete reviewData.Spot.SpotImages;
      return reviewData;
    });

    return res.json({ Reviews: formattedReviews });
  } catch (error) {
    next(error);
  }
});



// Route to update an existing review
router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    // Find a review before trying to update it
    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
      // TODO: Error handling
      let noExistingReviewError = new Error("Review couldn't be found");
      noExistingReviewError.status = 404;
      throw noExistingReviewError;
    }

    if (existingReview.userId !== userId) {
      // TODO: Error handling
      let notUserReviewError = new Error("Forbidden: This is not your review");
      notUserReviewError.status = 403;
      throw notUserReviewError;
    }

    // Editing the keys that we want to update
    existingReview.review = review;
    existingReview.stars = stars;
    // Save the changes --- update
    await existingReview.save();
    //  Add status message
    return res.json(existingReview);
  } catch (error) {
    next(error);
  }
});

// Route to delete an existing review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    console.log(`Attempting to delete review ${reviewId} by user ${userId}`);

    // Find the review by its ID
    const review = await Review.findByPk(reviewId);
    if (!review) {
      return res.status(404).json({
        message: "Review not found",

        status: 404
      });
    }

    // Check if the review belongs to the current user
    if (review.userId !== userId) {
      return res.status(403).json({
        message: "Forbidden",
        title: "Authorization required",
        errors: { message: "You don't have permission to delete this review" },
        status: 403
      });
    }

    // If the review exists and belongs to the user, delete it
    await review.destroy();
    res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("DELETE review error:", error);
    res.status(500).json({
      message: "Internal server error",
      title: "Server Error",
      errors: { message: "Something went wrong" },
      status: 500
    });
  }
});


module.exports = router;
