import { useDispatch } from "react-redux"; //, useSelector
import { useModal } from '../../context/Modal';
//import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';

const ManageSpotDeleteModal = ({ spotId }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();


    const handleClickDelete = async (e) => {
        e.preventDefault();

        await dispatch(spotActions.deleteSpotThunk(spotId)).then(closeModal())
        // await dispatch(spotActions.readSpotThunk(spotId)).then(closeModal())
    };

    return (
        <div className="review-modal-container">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to remove this spot from the listings?</div>
            <br />
            <button
                onClick={handleClickDelete}
                className="delete-review-button butt-wide"
                style={{ backgroundColor: '#E62539' }}
            >
                Yes (Delete Spot)
            </button>
            <button
                onClick={closeModal}
                className="keep-review-button butt-wide"
                style={{ backgroundColor: '#333333' }}
            >
                No (Keep Spot)
            </button>
        </div>
    )
}

export default ManageSpotDeleteModal