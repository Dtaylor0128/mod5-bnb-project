// PLA thunk-based fetch w/loading state -> useParams for dynamic routing -> 
// conditional rerendering for loading vs loaded states -> component composition

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import { getReviewsThunk } from "../../store/reviews";
import SpotInfo from "../../components/SpotInfo/SpotInfo";
import ReviewInfo from "../../components/ReviewsInfo/ReviewsInfo";


const SpotDetailsPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    // Get the spot details and reviews from the Redux store

    const spot = useSelector(state => state.spots.allSpots?.[spotId]);
    const reviews = useSelector(state => {
        if (!state.reviews?.bySpotId?.[spotId]) return [];
        return Object.values(state.reviews.bySpotId[spotId]);
    });
    const currUser = useSelector(state => state.session.user);


    // only run on mount or when spotId changes

    useEffect(() => {
        const loadSpotData = async () => {
            setIsLoaded(false);
            try {
                await dispatch(getSpotThunk(spotId));
                await dispatch(getReviewsThunk(spotId));
                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading spot data:', error);
                setIsLoaded(true);
            }
        };

        loadSpotData();
    }, [dispatch, spotId]);

    if (!isLoaded || !spot) return <h3>Loading spot details...</h3>;

    return (
        <div className="page">
            <SpotInfo spotDetails={spot} />
            <ReviewInfo spotDetails={spot} currUser={currUser} reviews={reviews} spotId={spotId} />
        </div>
    );
};

export default SpotDetailsPage;
//