import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
import './DeleteReviewModal.css';
import * as reviewActions from '../../store/reviews';
//import * as spotActions from '../../store/spots';


const DeleteReviewModal = ({ reviewId, spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    // - Add error handling
    const handleClickDelete = async (e) => {
        e.preventDefault();
        try {
            //only delete let redux handle the rest
            await dispatch(reviewActions.deleteReviewThunk(spotId, reviewId));
            // refresh reviews and spot data to update counts   
            // await dispatch(reviewActions.getReviewsThunk(spotId));
            // await dispatch(spotActions.getSpotThunk(spotId));
            closeModal();
        } catch (error) {
            console.error("Delete failed, but closing modal anyway");
            closeModal(); // Close even if delete fails
        }
    };

    return (
        <div className="delete-modal">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to delete this review?</div>
            <div className="delete-warning">
                <p>This action cannot be undone.</p>
            </div>


            <div className="button-container">
                <button
                    // tempoaraily disabled={true}
                    disabled={true}
                    onClick={handleClickDelete}
                    className="delete-review-button"
                    style={{ backgroundColor: '#E62539' }}
                >
                    Yes (Delete Review)
                </button>
                <button
                    onClick={closeModal}
                    className="keep-review-button"
                //style={{ backgroundColor: '#333333' }}
                >
                    No (Keep Review)
                </button>
            </div>
        </div>
    )
}
export default DeleteReviewModal