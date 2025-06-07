import { csrfFetch } from './csrf';

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
        const spots = await response.json();
        dispatch(getAllSpots(spots));
        return spots;
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

// Reducer
const initialState = {
    allSpots: {},
    singleSpot: {}
};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_SPOTS:
            const normalizedSpots = action.payload.reduce((acc, spot) => {
                acc[spot.id] = spot;
                return acc;
            }, {});
            return { ...state, allSpots: normalizedSpots };

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
