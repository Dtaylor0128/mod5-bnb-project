// PLA thunk-based fetch w/loading state -> useParams for dynamic routing -> 
// conditional rerendering for loading vs loaded states -> component composition

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectReviewsForSpot } from "../../store/reviews";
import { useParams } from "react-router-dom";
import { getSpotThunk } from "../../store/spots";
import { getReviewsThunk } from "../../store/reviews";
import SpotInfo from "../../components/SpotInfo/SpotInfo";
//import { selectAllSpots } from "../../store/spots";
import ReviewInfo from "../../components/ReviewsInfo/ReviewsInfo";


const SpotDetailsPage = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    const spot = useSelector(state => state.spots.allSpots?.[spotId]);
    const reviews = useSelector(selectReviewsForSpot(spotId));
    const currUser = useSelector(state => state.session.user);


    useEffect(() => {
        setIsLoaded(false);
        dispatch(getSpotThunk(spotId))
            .then(() => dispatch(getReviewsThunk(spotId)))
            .then(() => setIsLoaded(true));
    }, [dispatch, spotId]);

    if (!isLoaded) return <h3>Loading spot details...</h3>;

    return (
        <div className="page">
            <SpotInfo spotDetails={spot} />
            <ReviewInfo spotDetails={spot} currUser={currUser} reviews={reviews} spotId={spotId} />
        </div>
    );
};

export default SpotDetailsPage;
//