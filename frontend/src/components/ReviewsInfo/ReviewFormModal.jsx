import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews';
import { useModal } from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import { selectReviewsForSpot } from '../../store/reviews';
import "./ReviewFormModal.css";
import * as spotActions from '../../store/spots';

function ReviewFormModal({ spotId }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const starsArr = [1, 2, 3, 4, 5];

    const sessionUser = useSelector((state) => state.session.user)
    const spotReviews = useSelector(selectReviewsForSpot(spotId));
    const reviewExists = spotReviews.find(
        (review) => review.userId === sessionUser?.id
    );

    useEffect(() => {
        const errors = {};
        if (review.length < 10) errors.review = 'Must be at least 10 characters'
        if (!stars) errors.stars = 'Must select star rating'
        if (reviewExists) errors.review = "Review already exists for this spot"
        setErrors(errors);
    }, [review, stars, sessionUser?.id, reviewExists])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setHasSubmitted(true);
        setServerError("");

        if (Object.keys(errors).length > 0) return;

        const payload = { review, stars }
        try {
            //create review
            await dispatch(reviewActions.createReviewThunk(spotId, payload))
            // refresh review list to show new review
            await dispatch(reviewActions.getReviewsThunk(spotId));
            // refresh spot details to show updated review count and average rating
            await dispatch(spotActions.getSpotThunk(spotId))
            closeModal()
        } catch (err) {
            console.error("Error in handleSubmit:", err);
            setServerError("An error occurred while submitting your review. Please try again.");
        }
    }

    const isDisabled = Object.values(errors).length >= 1

    return (
        <div className="review-modal modal-box">
            <h1>How was your stay?</h1>
            {serverError && <p className="server-error">{serverError}</p>}
            <form onSubmit={handleSubmit} className="review-form">
                <div className="review-text-container">
                    <textarea
                        className="text-area"
                        type="text"
                        name="review"
                        value={review}
                        placeholder="Leave your review here..."
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                    {hasSubmitted && errors.review && <p>{errors.review}</p>}
                </div>
                <br />
                <div className='star-container'>
                    {starsArr.map((currStars) => (
                        <label key={currStars}>
                            <input
                                name="rating"
                                type="radio"
                                value={currStars}
                                onChange={() => setStars(currStars)}
                                required
                            />
                            <span
                                className="star"
                                name="rating"
                                style={{
                                    color:
                                        currStars <= (hover || stars) ? "#027373" : "#A9D9D0",
                                }}
                                onMouseEnter={() => setHover(currStars)}
                                onMouseLeave={() => setHover(null)}
                            >
                                <FaStar />
                            </span>
                        </label>
                    ))}
                    <span>Stars</span>
                </div>
                {hasSubmitted && errors.stars && <p>{errors.stars}</p>}
                <button disabled={isDisabled} type="submit" className="review-submit-button" >
                    Submit Your Review
                </button>
            </form>
        </div>
    )
}

export default ReviewFormModal
