import { csrfFetch } from './csrf';

const ADD_SPOT_IMAGE = "spots/createSpotImage"
//const UPDATE_SPOT_IMAGE = "spots/updateSpotImage"
const DELETE_SPOT_IMAGE = "spots/deleteSpotImage"


const createSpotImage = (payload) => ({
    type: ADD_SPOT_IMAGE,
    payload,
});

// const updateSpotImage = (payload) => ({
//     type: UPDATE_SPOT_IMAGE,
//     payload
// })
const deleteSpotImage = (imageId) => ({
    type: DELETE_SPOT_IMAGE,
    imageId,
});

export const createSpotImageThunk = (spotId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(createSpotImage({ ...data, spotId })); // Include spotId
    }
};

// export const createSpotImageThunk = (id, payload) => async (dispatch) => {
//     const response = await csrfFetch(`/api/spots/${id}/images`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//     });

//     if (response.ok) {
//         const data = await response.json()
//         dispatch(createSpotImage(data))
//     }
// };

export const deleteSpotImageThunk = (imageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spot-images/${imageId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteSpotImage(imageId));
        return true;
    }
    return false;
};

const initialState = {};

const spotImageReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ADD_SPOT_IMAGE: {
            const { spotId, ...image } = action.payload;
            return {
                ...state,
                allSpots: {
                    ...state.allSpots,
                    [spotId]: {
                        ...state.allSpots[spotId],
                        SpotImages: [...(state.allSpots[spotId]?.SpotImages || []), image]
                    }
                },
                singleSpot: {
                    ...state.singleSpot,
                    SpotImages: [...(state.singleSpot?.SpotImages || []), image]
                }
            };
        }
        // case UPDATE_SPOT_IMAGE:
        //     newstate = ;

        //     return newstate;
        case DELETE_SPOT_IMAGE:
            newState = { ...state };
            delete newState[action.imageId];
            return newState;
        default:
            return state;
    }
}


export default spotImageReducer