// --Imports--
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');

// --Sequelize Imports--
const { Review, ReviewImage } = require('../../db/models');


// Complete route /api/review-images/:imageId
// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {

        const imageId = req.params.imageId;

        // Find reviewimage and include the associated review to check if review belongs to owner
        const reviewImage = await ReviewImage.findByPk(imageId, {
            include: [{ model: Review }]
        });

        if (!reviewImage) {
            const error = new Error("Review Image couldn't be found");
            error.status = (404);
            throw error;
        }

        // If the logged in user is not the owner of the review
        if (req.user.id !== reviewImage.Review.userId) {
            const error = new Error("Forbidden");
            error.status = (403);
            throw error;
        }

        await reviewImage.destroy();
        res.status(200);
        return res.json({ message: "Successfully deleted" });

    } catch (error) {
        next(error); // Error handling stuff in app.js
    }
});

// Exports the route that will be used in the api/index.js
module.exports = router;
