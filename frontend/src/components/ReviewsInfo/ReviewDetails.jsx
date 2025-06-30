import DeleteReviewModal from "./DeleteReviewModal"
import OpenModalButton from "../OpenModalButton"
import "./ReviewDetails.css";

const ReviewDetails = ({ review, currUser, spotId, className }) => {

    // month and year formatting for the review date
    const timestamp = review.createdAt
    const date = new Date(timestamp)
    const options = { year: "numeric", month: "long" }
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

    return (
        <>
            {review && (
                <div className={`review-container ${className}`}>
                    <h4 className="review-user">{review.User?.firstName || currUser.firstName}</h4>
                    <p className="review-date">{formattedDate}</p>
                    <p className="review-text">{review.review}</p>
                    {currUser?.id === review.userId ? (
                        <span>
                            <OpenModalButton
                                buttonClassName="delete-review-button"
                                reviewId={review.id}
                                buttonText="Delete"
                                modalComponent={<DeleteReviewModal reviewId={review.id} spotId={spotId} />}
                            />{" "}
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            )}
        </>
    )
}

export default ReviewDetails