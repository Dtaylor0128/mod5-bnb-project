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

    //console.log(`Spot ID: ${spot.id}, Avg Rating: ${spot.avgRating}`);

    //format rating display
    const displayRating = spot.avgRating
        ? Number(spot.avgRating).toFixed(1)
        : 'New';

    //get preview image
    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;

    // return (
    //     <div
    //         className="spot-card"
    //         onClick={handleClick}
    //         onMouseEnter={() => setShowTooltip(true)}
    //         onMouseLeave={() => setShowTooltip(false)}
    //         style={{ cursor: 'pointer' }}
    //     >
    //         <div className="image-wrapper">
    //             {previewImage && <img src={previewImage} alt={spot.name} className="spot-image" />}
    //             {showTooltip && <div className="tooltip">{spot.name}</div>}
    //         </div>

    //         <div className="spot-details">
    //             <span className="top-line">
    //                 <span>{spot.city}, {spot.state}</span>
    //                 <span className="stars">
    //                     <FaStar />
    //                     {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
    //                 </span>
    //             </span>
    //             <p>${spot.price} / night</p>
    //         </div>
    //     </div>
    // )

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
                {/* Tooltip */}
                {showTooltip && (
                    <div className="tooltip">{spot.name}</div>
                )}
            </div>

            <div className="spot-details">
                <div className="location-rating">
                    {/* City and State */}
                    <span className="location">{spot.city}, {spot.state}</span>
                    {/* Star Rating */}
                    <span className="rating">
                        <FaStar className="star-icon" />
                        {displayRating}
                    </span>
                </div>
                {/* Price  */}
                <div className="price">
                    <span className="price-amount">${spot.price}</span>
                    <span className="night-label"> night</span>
                </div>
            </div>
        </div>
    );
}

export default SpotCard