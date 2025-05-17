import { csrfFetch } from "./csrf";



// Action Types


// ACTION CREATORS







/// THUNKS

export const getSpotsThunk = () => async (dispatch) => {
    try {

        const res = await csrfFetch('/api/spots');
        console.log(res);
    } catch (e) {
        console.log(e);
    }
}





//REDUCER