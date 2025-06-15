import { useEffect, useState } from "react"; //useState,useContext, , React
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { selectAllSpots } from "../../store/spots";
import SpotCard from "../../components/SpotCard/SpotCard"; // Assuming this is the correct path to your SpotCard component

const LandingPage = () => {
    const dispatch = useDispatch();
    const spots = useSelector(selectAllSpots);
    console.log("Spots in LandingPage:", spots);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]); // Fetch on mount

    if (!spots.length) return <div>Loading...</div>;

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
