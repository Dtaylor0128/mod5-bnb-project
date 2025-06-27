import DeleteReviewModal from "./DeleteReviewModal"
import OpenModalButton from "../OpenModalButton"
import "./ReviewDetails.css";

const ReviewDetails = ({ review, currUser, spotId, className }) => {

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
                    <p className="review">{review.review}</p>
                    {currUser?.id === review.userId ? (
                        <span>
                            <OpenModalButton
                                buttonClassName="delete-review-modal-button"
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