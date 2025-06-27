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
        avgRating = null,
        numReviews = 0
    } = spotDetails;

    // Use memoized selector for reviews for this spot
    const reviews = useSelector(selectReviewsForSpot(spotId));

    // Sort reviews newest first 
    const sortedReviews = [...reviews].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Derived values
    const hasUserReviewed = currUser && reviews.some(r => r.userId === currUser.id);
    const noReviews = reviews.length === 0;
    const showPostReview = currUser && currUser.id !== ownerId && !hasUserReviewed;

    // format average rating 
    const displayRating = avgRating ? Number(avgRating).toFixed(1) : "New";

    // Format review count 
    const reviewCountText = numReviews === 1 ? "1 Review" : `${numReviews} Reviews`;

    return (
        <div className="reviews-section">

            <h3 className="reviews-heading">
                <FaStar className="star-icon" />
                {displayRating}

                {numReviews > 0 && (
                    <>
                        <span className="dot"> · </span>
                        <span className="review-count">{reviewCountText}</span>
                    </>
                )}
            </h3>

            {/* Post Review Button */}
            {showPostReview && (
                <div className="post-review-section">
                    <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<ReviewFormModal spotId={spotId} />}
                    />

                    {/* Show message if no reviews yet */}
                    {noReviews && (
                        <p className="first-review-message">Be the first to post a review!</p>
                    )}
                </div>
            )}


            <div className="reviews-list">
                {sortedReviews.map((review, index) => (
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
    );
};


export default ReviewInfo;
// This component displays the average rating, number of reviews, and allows users to post new reviews.
// It uses a memoized selector to efficiently retrieve reviews for the specific spot.
// It also conditionally renders the "Post Your Review" button based on the current user and their review status.