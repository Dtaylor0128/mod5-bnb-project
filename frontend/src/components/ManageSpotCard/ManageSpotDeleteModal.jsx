import { useDispatch } from "react-redux"; //, useSelector
// import { useNavigate } from "react-router-dom";
import { useModal } from '../../context/Modal';
import { deleteSpotThunk } from "../../store/spots";
// import { Navigate } from "react-router-dom";
//import * as reviewActions from '../../store/reviews';
//import * as spotActions from '../../store/spots';

// const ManageSpotDeleteModal = ({ spotId }) => {
//     const dispatch = useDispatch()
//     const navigate = useNavigate();
//     const { closeModal } = useModal();


//     const handleClickDelete = async (e) => {
//         e.preventDefault();

//         await dispatch(deleteSpotThunk(spotId));
//         onclose();
//         navigate("/spots/current"); // redirect to mange spots page
//         // await dispatch(spotActions.readSpotThunk(spotId)).then(closeModal())
//     };
const ManageSpotDeleteModal = ({ spotId, onClose, onDeleteSuccess }) => {
    const dispatch = useDispatch();

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