import { useEffect, useState } from "react"; //useState,useContext, , React
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { selectAllSpots } from "../../store/spots";
import SpotCard from "../../components/SpotCard/SpotCard"; // Assuming this is the correct path to your SpotCard component

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots); // memoized selector
    //console.log("Spots in LandingPage:", spots);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
        console.log('useEffect running, about to dispatch getAllSpotsThunk');
    }, [dispatch]); // Fetch once mount

    if (!spots.length) return <div>Loading...</div>; // handles initial state

    return (
        <div className="spot-list">
            {spots.map(spot => (
                spot?.id && ( // Add null check
                    <SpotCard
                        key={spot.id} // Key here, NOT in SpotCard
                        spot={spot}
                    />
                )
            ))}
        </div>
    );
};

export default LandingPage;
