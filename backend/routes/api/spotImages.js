// --Imports--
const express = require('express');
const router = express.Router();

// --Utility Imports--
const { requireAuth } = require('../../utils/auth');

// --Sequelize Imports--
const { Spot, SpotImage } = require('../../db/models');



// Complete route /api/spot-images/:imageId
// Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imageId = req.params.imageId;

        // Find spotimage and include the associated spot to check if spot belongs to owner
        const spotImage = await SpotImage.findByPk(imageId, {
            include: [{ model: Spot }]
        });

        if (!spotImage) {
            const error = new Error("Spot Image couldn't be found");
            error.status = (404);
            throw error;
        }

        // If the logged in user is not the owner of the spot
        if (req.user.id !== spotImage.Spot.ownerId) {
            const error = new Error("Forbidden");
            error.status = (403);
            throw error;
        }

        await spotImage.destroy();

        res.status(200);
        return res.json({ message: "Successfully deleted" });

    } catch (error) {
        next(error); // Error handling stuff in app.js
    }
});

// Exports the route that will be used in the api/index.js
module.exports = router;
