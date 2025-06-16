import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import ReviewFormModal from "./ReviewFormModal";
import OpenModalButton from '../OpenModalButton';
import ReviewDetails from "./ReviewDetails";
import { selectReviewsForSpot } from "../../store/reviews"; // Memoized selector

const ReviewInfo = ({ spotDetails = {}, currUser, spotId }) => {
    // Safe destructuring with defaults
    const {
        ownerId = null,
        avgStarRating = null,
        numReviews = 0
    } = spotDetails;

    // Use memoized selector for reviews for this spot
    const reviews = useSelector(selectReviewsForSpot(spotId));

    // Derived values
    const hasUserReviewed = currUser && reviews.some(r => r.userId === currUser.id);
    const noReviews = reviews.length === 0;
    const showPostReview = currUser && currUser.id !== ownerId && !hasUserReviewed;

    return (
        <div>
            <h3 className="spot-rating">
                <FaStar />
                {avgStarRating ? avgStarRating.toFixed(1) : "New"}
                {numReviews > 0 && <> ・{numReviews} {numReviews === 1 ? "review" : "reviews"}</>}
            </h3>
            <div className="reviews-header">
                {showPostReview && (
                    <div>
                        <OpenModalButton
                            buttonText="Post Your Review"
                            itemText="Post your review"
                            modalComponent={<ReviewFormModal spotId={spotId} />}
                        />
                        {noReviews && <p>Be the first to post a review!</p>}
                    </div>
                )}

                <div className="reviews">
                    {reviews.map((review, index) => (
                        <ReviewDetails
                            key={review.id}
                            currUser={currUser}
                            review={review}
                            spotId={spotId}
                            className={index % 2 === 0 ? "review-even" : "review-odd"}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewInfo;
// This component displays the average rating, number of reviews, and allows users to post new reviews.
// It uses a memoized selector to efficiently retrieve reviews for the specific spot.
// It also conditionally renders the "Post Your Review" button based on the current user and their review status.