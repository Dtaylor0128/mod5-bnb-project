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



export const deleteSpotImageThunk = (imageId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spot-images/${imageId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        const { deletedImage } = await response.json();
        dispatch(deleteSpotImage({
            imageId,
            spotId: deletedImage.spotId // Critical for reducer
        }));
        return true;

    } else {
        const errorData = await response.json();
        console.error('Delete image failed:', errorData);
        throw new Error(errorData.message || 'Failed to delete image');
    }

};

const initialState = {};

// This reducer will handle the state for spot images
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
        case DELETE_SPOT_IMAGE:
            newState = { ...state };

            // 1. Remove from allSpots
            Object.keys(newState.allSpots).forEach(spotId => {
                newState.allSpots[spotId] = {
                    ...newState.allSpots[spotId],
                    SpotImages: newState.allSpots[spotId]?.SpotImages?.filter(
                        img => img.id !== action.imageId
                    ) || []
                };
            });

            // 2. Remove from singleSpot
            if (newState.singleSpot?.SpotImages) {
                newState.singleSpot = {
                    ...newState.singleSpot,
                    SpotImages: newState.singleSpot.SpotImages.filter(
                        img => img.id !== action.imageId
                    )
                };
            }
            return newState;
        default:
            return state;
    }

}

export default spotImageReducer