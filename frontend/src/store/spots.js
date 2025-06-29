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
        console.log('API Response:', data); // Debug: Check structure
        console.log('Spots Array:', data.Spots); // Debug: Check spots

        // Method 1: Using Object.fromEntries() + map()
        const normalized = Object.fromEntries(
            data.Spots.map(spot => [spot.id, spot])
        );

        // Method 2: Using forEach() 
        // const normalized = {};
        // data.Spots.forEach(spot => {
        //     normalized[spot.id] = spot;
        // });

        dispatch(getAllSpots(normalized));
        return normalized;
    }
};


export const getSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const data = await response.json();
        // Normalize SpotImages array
        const spotWithImages = {
            ...data,
            SpotImages: data.SpotImages || [] // ensure array exist
        };
        dispatch(getSpot(spotWithImages));
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
// Update a spot with spot data
// spotData should include all necessary fields for the update
export const updateSpotThunk = (spotData) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotData.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotData)
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


// Reducer 
const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            return {
                ...state,
                allSpots: action.payload // normalized in thunk
            };

        case GET_SPOT: {
            // Wrapping in {} is fine, but always return state in default!
            const { id, SpotImages = [], ...spotData } = action.payload;
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [id]: {
                        ...state.allSpots[id],
                        ...spotData,
                        SpotImages
                    }
                },
                singleSpot: action.payload
            };
        }

        case CREATE_SPOT:
        case UPDATE_SPOT: {
            //const updatedSpot = action.spot;
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
        }
        case DELETE_SPOT: {
            // Wrap in {} if you declare variables
            const newState = {
                ...state,
                allSpots: { ...state.allSpots },
                singleSpot: {}
            };
            delete newState.allSpots[action.payload];
            return newState;
        }

        default:
            // Always return state in default!
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
    [state => state.spots?.allSpots || {}],
    allSpots => Object.values(allSpots).filter(spot => spot && spot.id)
);