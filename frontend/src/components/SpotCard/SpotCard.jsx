import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./SpotCard.css";
const SpotCard = ({ spot = {} }) => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        navigate(`/spots/${spot.id}`);
    };


    //format rating display
    const displayRating = spot.avgRating
        ? Number(spot.avgRating).toFixed(1)
        : "New";

    // Format review count 
    const reviewCount = spot.numReviews || 0;
    const reviewCountText = reviewCount === 1 ? "1 Review" : `${reviewCount} Reviews`;

    //get preview image
    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;

    return (
        <div
            className="spot-card"
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="image-container">
                <img
                    src={previewImage}
                    alt={spot.name}
                    className="spot-image"
                    onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                />
                {showTooltip && (
                    <div className="tooltip">{spot.name}</div>
                )}
            </div>

            <div className="spot-details">
                <div className="location-rating">
                    <span className="location">{spot.city}, {spot.state}</span>
                    {/* Display rating with star icon */}
                    <span className="rating">
                        <FaStar className="star-icon" />
                        {displayRating}
                        {/* Show review count if greater than 0 */}
                        {reviewCount > 0 && (
                            <>
                                <span className="dot"> · </span>
                                <span className="review-count">{reviewCountText}</span>
                            </>
                        )}
                    </span>
                </div>
                <div className="price">
                    <span className="price-amount">${spot.price}</span>
                    <span className="night-label"> night</span>
                </div>
            </div>
        </div>
    );

}

export default SpotCard