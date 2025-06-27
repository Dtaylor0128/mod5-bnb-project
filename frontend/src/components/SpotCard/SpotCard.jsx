import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import "./SpotCard.css";
const SpotCard = ({ spot = {} }) => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;
    const handleClick = () => {
        navigate(`/spots/${spot.id}`);
    };

    //console.log(`Spot ID: ${spot.id}, Avg Rating: ${spot.avgRating}`);

    return (
        <div
            className="spot-card"
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ cursor: 'pointer' }}
        >
            <div className="image-wrapper">
                {previewImage && <img src={previewImage} alt={spot.name} className="spot-image" />}
                {showTooltip && <div className="tooltip">{spot.name}</div>}
            </div>

            <div className="spot-details">
                <span className="top-line">
                    <span>{spot.city}, {spot.state}</span>
                    <span className="stars">
                        <FaStar />
                        {spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}
                    </span>
                </span>
                <p>${spot.price} / night</p>
            </div>
        </div>
    )
}

export default SpotCard