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
        dispatch(getAllSpotsThunk(spots));
        return spots;
    }
};
export const getSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
        const spot = await response.json();
        dispatch(getSpotThunk(spot));
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
export const updateExistingSpot = (spot) => async (dispatch) => {
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
export const deleteExistingSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        dispatch(deleteSpot(spotId));
        return spotId;
    }
};
// Reducer
const initialState = {};
const spotsReducer = (state = initialState, action) => {
    let newState;

    switch (action.type) {
        case CREATE_SPOT:
            return { ...state, [action.payload.id]: action.payload };
        case GET_SPOT:
            return { ...state, [action.payload.id]: action.payload };
        case GET_ALL_SPOTS:
            const spotsArr = action.payload.Spots;
            //makes new spot in memory
            newState = { ...state }; // copy new state
            newState.getAllSpots = new state;
            let newByIdGetAllSpots = {};
            for (let spot of spotsArr) {
                newByIdGetAllSpots[spot.id] = spot; // add each spot to the new object  
            }
            newState.byIdGetAllSpots = newByIdGetAllSpots; // assign the new object to the state

            return newState;

        case UPDATE_SPOT:
            return { ...state, [action.payload.id]: action.payload };
        case DELETE_SPOT:
            const newState = { ...state };
            delete newState[action.payload];
            return newState;
        default:
            return state;
    }
};
export default spotsReducer;
