import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton';
import ManageSpotDeleteModal from "./ManageSpotDeleteModal";
import './ManageSpotCard.css';
//1
const ManageSpotCard = ({ spot }) => {

    const navigate = useNavigate();

    // Fallback for missing preview image
    const previewImage = spot.previewImage || (spot.SpotImages && spot.SpotImages.length > 0
        ? spot.SpotImages.find(img => img.preview)?.url || spot.SpotImages[0].url
        : 'ranchBnb.jpg');

    // Format rating for display
    const displayRating = spot.avgRating
        ? Number(spot.avgRating).toFixed(2)
        : 'New';

    // Handlers
    const handleCardClick = () => navigate(`/spots/${spot.id}`);
    const handleUpdateClick = (e) => {
        e.stopPropagation();
        navigate(`/spots/${spot.id}/edit`);
    };

    return (
        <div className="manage-spot-card" onClick={handleCardClick} tabIndex={0} role="button">
            <div className="image-container">
                <img
                    src={previewImage}
                    alt={spot.name}
                    className="spot-image"
                    onError={e => { e.target.src = 'ranchBnb.jpg'; }}
                />
            </div>
            <div className="spot-info">
                <div className="location-rating">
                    <span>{spot.city}, {spot.state}</span>
                    <span className="rating">
                        <FaStar className="star-icon" />
                        {displayRating}
                    </span>
                </div>
                <div className="price">${spot.price} <span className="night">night</span></div>
            </div>
            <div className="action-buttons">
                <button
                    className="update-button"
                    onClick={handleUpdateClick}
                    aria-label="Update spot"
                >
                    Update
                </button>
                <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<ManageSpotDeleteModal spotId={spot.id} />}
                    className="delete-button"
                    onButtonClick={e => e.stopPropagation()}
                    aria-label="Delete spot"
                />
            </div>
        </div>
    );
};

export default ManageSpotCard;


