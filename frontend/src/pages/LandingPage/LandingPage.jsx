import { useEffect } from "react"; //useState,useContext, , React
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { selectAllSpots } from "../../store/spots";
import SpotCard from "../../components/SpotCard/SpotCard"; // Assuming this is the correct path to your SpotCard component
import "./LandingPage.css"; // Assuming you have a CSS file for styling

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots); // memoized selector
    //console.log("Spots in LandingPage:", spots);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]); // Fetch once mount

    if (!Array.isArray(spots) || spots.length === 0) {
        return (
            <div className="loading-container">
                <div>Loading amazing places...</div>
            </div>
        ); // handles initial state
    }

    return (
        <div className="landing-page">
            <div className="spots-grid">
                {spots.map(spot => (
                    spot?.id && ( // Add null check
                        <SpotCard
                            key={spot.id} // Key here, NOT in SpotCard
                            spot={spot}
                        />
                    )
                ))}
            </div>
        </div>
    );
};

export default LandingPage;
