import { useNavigate } from 'react-router-dom';
import { FaStar } from "react-icons/fa";
import OpenModalButton from '../OpenModalButton';
import ManageSpotDeleteModal from "./ManageSpotDeleteModal";
import './ManageSpotCard.css';

const ManageSpotCard = ({ spot }) => {
    const navigate = useNavigate();

    // Fallback for missing preview image
    const previewImage = spot.previewImage || (spot.SpotImages && spot.SpotImages.length > 0
        ? spot.SpotImages.find(img => img.preview)?.url || spot.SpotImages[0].url
        : 'https://via.placeholder.com/400x300?text=No+Image');

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
                    onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
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

// import { useState } from "react";
// import { useNavigate } from 'react-router-dom';
// import OpenModalButton from '../OpenModalButton'
// import ManageSpotDeleteModal from "./ManageSpotDeleteModal";
// import { FaStar } from "react-icons/fa";
// import './ManageSpotCard.css'

// const ManageSpotCard = ({ spot }) => {
//     const navigate = useNavigate();
//     const [showTooltip, setShowTooltip] = useState(false);

//     if (!spot) return null; // Handle case where spot is not provided   

//     //handle rating
//     const displayRating = spot.avgRating ? spot.avgRating.toFixed(1) : 'New';

//     // image handling
//     const previewImage = spot.previewImage || 'https://cdn1.iconfinder.com/data/icons/telecommuting-rounded/16/elecommuting_teleworking_placeholder_house_location_-512.png'; // Default image if no previewImage is provided

//     const handleClick = () => {
//         navigate(`/spots/${spot.id}`);
//     };
//     const handleUpdateClick = (e) => {
//         e.stopPropagation();
//         navigate(`/spots/${spot.id}/edit`);
//     };

//     // const handleModalClick = (e) => {
//     //     e.stopPropagation();
//     // };


//     //console.log(`Spot ID: ${spot.id}, Avg Rating: ${spot.avgRating}`);

//     return (
//         <div className="manage-spot-card"
//             onClick={handleClick}
//             onMouseEnter={() => setShowTooltip(true)}
//             onMouseLeave={() => setShowTooltip(false)}
//             role="button"
//             tabIndex={0}
//         >
//             <div className="image-container">
//                 <img
//                     src={previewImage}
//                     alt={spot.name || "Spot preview"}
//                     className="spot-image"
//                     onError={(e) => {
//                         e.target.src = 'https://cdn1.iconfinder.com/data/icons/telecommuting-rounded/16/elecommuting_teleworking_placeholder_house_location_-512.png';
//                     }}
//                 />
//                 {showTooltip && <div className="image-tooltip">{spot.name}</div>}
//             </div>

//             <div className="spot-info">
//                 <div className="location-rating">
//                     <span>{spot.city}, {spot.state}</span>
//                     <span className="rating">
//                         <FaStar className="star-icon" />
//                         {displayRating}
//                     </span>
//                 </div>

//                 <div className="price">${spot.price} <span className="night">night</span></div>
//             </div>

//             <div className="action-buttons">
//                 <button
//                     className="update-button"
//                     onClick={handleUpdate}
//                     aria-label="Update spot"
//                 >
//                     Update
//                 </button>

//                 <OpenModalButton
//                     buttonText="Delete"
//                     modalComponent={<ManageSpotDeleteModal spotId={spot.id} />}
//                     className="delete-button"
//                     onButtonClick={(e) => e.stopPropagation()}
//                     aria-label="Delete spot"
//                 />
//             </div>
//         </div>
//     );
// };

// export default ManageSpotCard;
