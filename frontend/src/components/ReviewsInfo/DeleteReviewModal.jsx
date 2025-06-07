import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
//import './DeleteReviewModal.css'
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';


const DeleteReviewModal = ({ reviewId, spotId }) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const currSpotId = useSelector((state) => state.spots.id)

    //console.log("ID", currSpotId)


    const handleClickDelete = async (e) => {
        e.preventDefault();

        await dispatch(reviewActions.deleteReviewsThunk(reviewId, currSpotId))
        await dispatch(spotActions.getSpotThunk(spotId)).then(closeModal())
    };


    return (
        <div className="review-modal-container">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to delete this review?</div>
            <br />
            <br />
            <button
                onClick={handleClickDelete}
                className="delete-review-button butt-wide"
                style={{ backgroundColor: '#E62539' }}
            >
                Yes (Delete Review)
            </button>
            <button
                onClick={closeModal}
                className="keep-review-button butt-wide"
                style={{ backgroundColor: '#333333' }}
            >
                No (Keep Review)
            </button>
        </div>
    )
}
export default DeleteReviewModal