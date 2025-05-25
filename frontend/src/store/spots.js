import { act } from "react";
import { csrfFetch } from "./csrf";



// Action Types
const Get_ALL_SPOTS = "spots/getAllSpots";


// ACTION CREATORS //spots
//step 6
const getAllSpotsAction = (data) => {
    return {
        type: Get_ALL_SPOTS,
        payload: data
    }
}






/// THUNKS

export const getSpotsThunk = () => async (dispatch) => {

    try {
        //step 3
        //console.log("we are in the thunk");
        const res = await csrfFetch('/api/spots');
        if (res.ok) {
            //grab data
            // step 5
            const data = await res.json();
            //console.log("we are in the thunk", data);
            dispatch(getAllSpotsAction(data));
            //console.log(data);

        } else {
            throw res;
        }


    } catch (e) {
        console.log(e);
    }
}




// step 7
//REDUCER
// normalizing our state
const initialState = { allSpots: {}, singleSpot: {} };

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case Get_ALL_SPOTS: {
            const allSpots = {};
            action.payload.Spots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return { ...state, allSpots }; // <-- Corrected
        }
        default:
            return state; // <-- Only return state here
    }
};

export default spotsReducer;