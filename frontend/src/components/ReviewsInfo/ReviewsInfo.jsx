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

// import { FaStar } from "react-icons/fa";
// //import { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import ReviewFormModal from "./ReviewFormModal";
// import OpenModalButton from '../OpenModalButton'
// import ReviewDetails from "./ReviewDetails";
// import { selectReviewsForSpot } from "../../store/reviews";




// const ReviewInfo = ({ spotDetails = {}, currUser, spotId }) => {
//     // safe destructing with defaults 

//     const {
//         ownerId = null,
//         avgStarRating = null,
//         numReviews = 0,
//     } = spotDetails || {};


//     // const {
//     //     ownerId,
//     //     avgStarRating,
//     //     numReviews,
//     // } = spotDetails //Owner, SpotImages,city,  country, description,name,  price, state

//     // memoized selector for reviews for this spot
//     const reviews = useSelector(selectReviewsForSpot(spotId));

//     // derived values
//     const hasUserReviewed = currUser && reviews.some(r => r.userId === currUser.id);
//     const noReviews = reviews.length === 0;
//     const showPostReview = currUser && currUser.id !== ownerId && !hasUserReviewed;
//     //const [noReviews, setNoReviews] = useState(false);


//     const userReviews = reviews.filter(
//         (reviews) => reviews.userId === currUser?.id
//     );

//     const sortedSpotReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

//     useEffect(() => {
//         if (sortedSpotReviews.length === 0) {
//             setNoReviews(true);
//         } else {
//             setNoReviews(false);
//         }
//     }, [sortedSpotReviews]);

//     return (
//         <div>
//             <h3 className="spot-rating">
//                 <FaStar />
//                 {avgStarRating ? avgStarRating.toFixed(1) : "New"}{" "}
//                 {numReviews ? "・" + numReviews : ""}{" "}
//                 {numReviews === 0 ? "" : numReviews > 1 ? "reviews" : "review"}
//             </h3>
//             <div className="reviews-header">

//                 {currUser ? (

//                     currUser.id !== ownerId && noReviews ? (
//                         <div>
//                             <OpenModalButton
//                                 buttonText="Post Your Review"
//                                 itemText="Post your review"
//                                 modalComponent={<ReviewFormModal spotId={spotId} />}
//                             />
//                             <p>Be the first to post a review!</p>
//                         </div>

//                     ) : currUser &&
//                         currUser.id !== ownerId &&
//                         userReviews.length === 0 ? (
//                         <>
//                             {
//                                 <OpenModalButton
//                                     buttonText="Post Your Review!"
//                                     modalComponent={<ReviewFormModal spotId={spotId} />}
//                                 />
//                             }
//                         </>
//                     ) : (
//                         <></>
//                     )
//                 ) : (
//                     <></>
//                 )}

//                 <div className="reviews">
//                     {sortedSpotReviews.map((review, index) => (
//                         <ReviewDetails
//                             key={review.id}
//                             currUser={currUser}
//                             review={review}
//                             spotId={spotId}
//                             className={index % 2 === 0 ? "review-even" : "review-odd"}
//                         />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ReviewInfo