// PLA thunk-based fetch w/loading state -> useParams for dynamic routing -> 
// conditional rerendering for loading vs loaded states -> component composition

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import { getReviewsThunk } from "../../store/reviews";
import SpotInfo from "../../components/SpotInfo/SpotInfo";
//import { selectAllSpots } from "../../store/spots";
import ReviewInfo from "../../components/ReviewsInfo/ReviewsInfo";
import { selectReviewsForSpot } from "../../store/reviews";

const SpotDetailsPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    // Select just the spot and reviews you need
    //const spots = useSelector(selectAllSpots);
    const spot = useSelector(state => state.spots.allSpots?.[spotId]);
    const currUser = useSelector(state => state.session.user);
    //const reviews = useSelector(state => state.reviews.bySpotId?.[spotId] || []);
    // const reviews = useSelector(state =>
    //     state.reviews?.bySpotId?.[spotId] ? Object.values(state.reviews.bySpotId[spotId]) : []
    // );
    // const reviews = useSelector(selectReviewsForSpot(spotId));
    const reviews = useSelector(state =>
        state.reviews?.bySpotId?.[spotId] ? Object.values(state.reviews.bySpotId[spotId]) : []
    );


    useEffect(() => {
        setIsLoaded(false);
        dispatch(getSpotThunk(spotId))
            .then(() => dispatch(getReviewsThunk(spotId)))
            .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);

    if (!isLoaded) return <h3>Loading...</h3>;

    return (
        <div className="page">
            <SpotInfo spot={spot} />
            <ReviewInfo spot={spot} currUser={currUser} reviews={reviews} spotId={spotId} />
        </div>
    );
};

export default SpotDetailsPage;