import { csrfFetch } from "./csrf";
import { createSelector } from "@reduxjs/toolkit";

const CREATE_REVIEW = "reviews/createReview"
const GET_REVIEWS = "reviews/getReviews"
const DELETE_REVIEW = "reviews/deleteReview"

// Action creators 
// wrap data in payload object for consistency and predictability

// const createReview = (review) => {
//     return {
//         type: CREATE_REVIEW,
//         payload: review
//     }
// };
const createReview = (review) => ({
    type: CREATE_REVIEW,
    payload: review
});

const getReviews = (payload) => ({
    type: GET_REVIEWS,
    payload// {spotId, reviews}
});

const deleteReview = (payload) => ({
    type: DELETE_REVIEW,
    payload // { spotId, reviewId}
})

//Thunks

export const createReviewThunk = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(createReview({ ...data, spotId }));
        return data;
    }
};

export const getReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
        const data = await response.json();
        dispatch(getReviews({ spotId, reviews: data.Reviews }));
        return data;
    }
};

export const deleteReviewThunk = (spotId, reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`,
        {
            method: "DELETE"
        });
    if (response.ok) {
        dispatch(deleteReview({ spotId, reviewId }));
    }
};

// initial State
const initialState = {
    bySpotId: {} // Normalized: { [spotId]: { [reviewId]: review } }
};


//reducer 
const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case CREATE_REVIEW: {
            const { spotId, ...review } = action.payload;
            newState = { ...state };
            if (!newState.bySpotId[spotId]) newState.bySpotId[spotId] = {};
            newState.bySpotId[spotId][review.id] = review;
            return newState;
        }
        case GET_REVIEWS: {
            const { spotId, reviews } = action.payload;
            newState = { ...state, bySpotId: { ...state.bySpotId } };
            newState.bySpotId[spotId] = {};
            reviews.forEach(review => {
                newState.bySpotId[spotId][review.id] = review;
            });
            return newState;
        }
        case DELETE_REVIEW: {
            const { spotId, reviewId } = action.payload;
            newState = { ...state, bySpotId: { ...state.bySpotId } };
            if (newState.bySpotId[spotId]) {
                delete newState.bySpotId[spotId][reviewId];
            }
            return newState;
        }
        default:
            return state;
    }
};

export default reviewsReducer;


// Memoized Selector for all reviews for a spot
// Get specific review by ID
// export const selectReviewsForSpot = (spotId) => createSelector(
//     state => state.reviews?.bySpotId?.[spotId] || {}, // optional chaining
//     reviewsObj => Object.values(reviewsObj) // stable if reviewsObj hasn/t changed
// );

export const selectReviewsForSpot = (spotId) => createSelector(
    state => state.reviews?.bySpotId?.[spotId] || [],// return and array when empty to not break memoization
    reviewsObj =>
        Object.values(reviewsObj).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
);

// get review by ID
export const selectReviewById = (spotId, reviewId) =>
    state => state.reviews.bySpotId?.[spotId]?.[reviewId];

