
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
//import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton'
import ManageSpotDeleteModal from "./ManagSpotDeleteModal";
import { FaStar } from "react-icons/fa";
import './ManageSpotCard.css'

const ManageSpotCard = ({ spot }) => {
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
        navigate(`/spots/${spot.id}`);
    };
    const handleUpdateClick = (e) => {
        e.stopPropagation();
        navigate(`/spots/${spot.id}/edit`);
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // const closeMenu = (e) => {
    //     if (!ulRef.current.contains(e.target)) {
    //       setShowMenu(false);
    //     }
    //   };
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
                <img
                    src={spot.previewImage}
                    alt={spot.name}
                    className="spot-image"
                />
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
            <div className="spot-buttons">
                <div>
                    <button onClick={handleUpdateClick}>
                        Update
                    </button>
                </div>
                <div onClick={handleModalClick}>
                    <OpenModalButton
                        buttonText="Delete"
                        //   onClick={handleModalClick}
                        //   onButtonClick={closeMenu}
                        modalComponent={<ManageSpotDeleteModal spotId={spot.id} />}
                    />
                </div>
            </div>
        </div>
    )
}
export default ManageSpotCard;
