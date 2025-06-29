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
        const image = await SpotImage.findByPk(imageId);

        if (!image) {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }

        // Verify ownership through the spot
        const spot = await Spot.findByPk(image.spotId);
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await image.destroy();
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
