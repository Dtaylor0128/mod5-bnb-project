import { useDispatch } from "react-redux"; //, useSelector

import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from "../../store/spots";

const ManageSpotDeleteModal = ({ spotId, onClose, onDeleteSuccess }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const handleClickDelete = async (e) => {
        e.preventDefault();
        try {
            await dispatch(deleteSpotThunk(spotId));
            onClose();
            onDeleteSuccess(); // Use callback instead of navigate
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    return (
        <div className="delete-spot-modal-container">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to remove this spot from the listings?</div>
            <br />
            <button
                onClick={handleClickDelete}
                className="delete-spot-button"
                style={{ backgroundColor: '#E62539' }}
            >
                Yes (Delete Spot)
            </button>
            <button
                onClick={closeModal}
                className="keep-spot-button"
                style={{ backgroundColor: '#333333' }}
                disabled={true}
            >
                No (Keep Spot)
            </button>
        </div>
    )
}

export default ManageSpotDeleteModal