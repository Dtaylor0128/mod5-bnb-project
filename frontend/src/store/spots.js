import { csrfFetch } from './csrf';
import { createSelector } from '@reduxjs/toolkit';
//Action types CRUD
const CREATE_SPOT = "spots/createSpot"
const GET_SPOT = "spots/getSpot"
const GET_ALL_SPOTS = "spots/getAllSpots"
const UPDATE_SPOT = "spots/updateSpot"
const DELETE_SPOT = "spots/deleteSpot"

// Action creators
const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        payload: spot
    };
};
const getSpot = (spot) => {
    return {
        type: GET_SPOT,
        payload: spot
    };
};
const getAllSpots = (spots) => {
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    };
};
const updateSpot = (spot) => {
    return {
        type: UPDATE_SPOT,
        payload: spot
    };
};
const deleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        payload: spotId
    };
};

// Thunks


export const getAllSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');
    if (response.ok) {
        const data = await response.json();
        //best practice to normalize witihin thunk as well spots array to object
        const normalize = {};
        data.Spots.forEach(spot => {
            normalize[spot.id] = spot;
        })
        dispatch(getAllSpots(normalize));
        return normalize;
    }
};
export const getSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spot = await response.json();
        dispatch(getSpot(spot));
        return spot;
    }
};
export const createNewSpotThunk = (spot) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    });
    if (response.ok) {
        const newSpot = await response.json();
        dispatch(createSpot(newSpot));
        return newSpot;
    }
};
export const updateSpotThunk = (spot) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    });
    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(updateSpot(updatedSpot));
        return updatedSpot;
    }
};
export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(deleteSpot(spotId));
        return spotId;
    }
};

// step 7
// normalize our state
// const initialState = {
//     byId: {}, // to store spots by their ID
//     getAllSpots: [], // to store all spots fetched

// };

//Inital state
const initialState = {
    allSpots: {},// normalize object
    singleSpot: {}
};

// const spotsReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case GET_ALL_SPOTS:
//             const normalizedSpots = action.payload.reduce((acc, spot) => {
//                 acc[spot.id] = spot;
//                 return acc;
//             }, {});
//             return { ...state, allSpots: normalizedSpots };

// spotsSlice should take an array of spots and transform them into objects using accumulator0.2

// Reducer 
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return {
                ...state,
                allSpots: action.payload // normalized in thunk
            };
        // return {
        //     ...state,
        //     allSpots: action.payload.Spots.reduce((acc, spot) => {
        //         acc[spot.id] = spot; // Normalize spots by ID
        //         return acc;
        //     }, {})
        // };

        case GET_SPOT:
        case CREATE_SPOT:
        case UPDATE_SPOT:
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [action.payload.id]: action.payload
                },
                singleSpot: {
                    [action.payload.id]: action.payload
                }
            };

        case DELETE_SPOT:
            const newState = {
                ...state,
                allSpots: { ...state.allSpots },
                singleSpot: {}
            };
            delete newState.allSpots[action.payload];
            return newState;

        default:
            return state;
    }
};

export default spotsReducer;


/*/ Memoized selector 
createSelector memoizes the result -> 
Stable Reference: Returns same array reference if allSpots doesn't change
Empty Handling: Safely handles undefined allSpots
*/
export const selectAllSpots = createSelector(
    (state) => state.spots.allSpots,
    (allSpots) => Object.values(allSpots || {})
);

