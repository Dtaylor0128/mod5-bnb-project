import { useDispatch } from "react-redux";
import { useModal } from '../../context/Modal';
//import './DeleteReviewModal.css'
import * as reviewActions from '../../store/reviews';
//import * as spotActions from '../../store/spots';


const DeleteReviewModal = ({ reviewId, spotId }) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    //     const handleClickDelete = async (e) => {
    //         e.preventDefault();
    //         console.log('Deleting review:', { reviewId, spotId }); // Debug log
    //         try {
    //             //correct function name and parameter order
    //             await dispatch(reviewActions.deleteReviewThunk(spotId, reviewId));
    //             // Close modal after successful deletion
    //             closeModal();
    //         } catch (error) {
    //             console.error("Failed to delete review:", error);
    //         }
    //     };

    // - Add error handling
    const handleClickDelete = async (e) => {
        e.preventDefault();
        try {
            await dispatch(reviewActions.deleteReviewThunk(spotId, reviewId));
            closeModal();
        } catch (error) {
            console.error("Delete failed, but closing modal anyway");
            closeModal(); // Close even if delete fails
        }
    };

    return (
        <div className="review-modal-container">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to delete this review?</div>
            <br />
            <br />
            <button
                // tempoaraily disabled={true}
                disabled={true}
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