import { useEffect, useState } from "react"; //useState,useContext, , React
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import SpotCard from "../../components/SpotCard/SpotCard"; // Assuming this is the correct path to your SpotCard component

const LandingPage = () => {
    const dispatch = useDispatch();

    //const spots = Object.values(useSelector((state) => state.spots))
    const safeData = data || {};
    const values = Object.values(safeData);
    const spots = useSelector((state) => state.spots ? Object.values(state.spots) : []);
    console.log("Spots in LandingPage:", spots);
    const [isLoaded, setIsLoaded] = useState(false);

    // useEffect(() => {
    //     if(Object.keys(spots).length === 0)
    //         console.log('dispatch')
    //         dispatch(loadAllSpots())

    // },[dispatch])


    useEffect(() => {
        if (!isLoaded) {
            //console.log("Dispatching loadAllSpots");
            dispatch(getAllSpotsThunk())
            setIsLoaded(true);
        }
    }, [dispatch, setIsLoaded, isLoaded]);


    return (
        <>
            <div className="spot-list">
                {spots &&
                    spots.map((spot) => (
                        <SpotCard key={spot.id} spot={spot} />
                    ))}
            </div>
        </>

    );
};

export default LandingPage