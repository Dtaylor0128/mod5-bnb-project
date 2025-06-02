import { useEffect, useState } from "react"; //useState,useContext, , React
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import SpotCard from "../../components/SpotCard/SpotCard"; // Assuming this is the correct path to your SpotCard component


// const LandingPage = () => {
//     const dispatch = useDispatch();

//     //const spots = Object.values(useSelector((state) => state.spots))
// 
//     const values = Object.values(data);
//     const spots = useSelector((state) => state.spots ? Object.values(state.spots) : []);
//     console.log("Spots in LandingPage:", spots);
//     const [isLoaded, setIsLoaded] = useState(false);

//     // useEffect(() => {
//     //     if(Object.keys(spots).length === 0)
//     //         console.log('dispatch')
//     //         dispatch(loadAllSpots())

//     // },[dispatch])

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 //only fetch if no spots exist
//                 if (spots.length === 0) {
//                     await dispatch(getAllSpotsThunk());
//                 }
//             } catch (error) {
//                 console.error("Error loading spots:", error);
//             }
//         }
//     });





//     // useEffect(() => {
//     //     if (!isLoaded) {
//     //         //console.log("Dispatching loadAllSpots");
//     //         dispatch(getAllSpotsThunk())
//     //         setIsLoaded(true);
//     //     }
//     // }, [dispatch, setIsLoaded, isLoaded]);


//
// };

const LandingPage = () => {
    const dispatch = useDispatch();
    //const [isLoaded, setIsLoaded] = useState(false);
    // Get spots from Redux store
    // const spots = useSelector(state =>
    //     state.spots.allSpots ? Object.values(state.spots.allSpots) : []
    // );
    const spots = useSelector((state) => state.spots ? Object.values(state.spots) : []);
    // Simplified useEffect for initial load
    useEffect(() => {
        const loadData = async () => {
            try {
                // Only fetch if no spots exist
                if (spots.length === 0) {
                    await dispatch(getAllSpotsThunk());
                }
            } catch (error) {
                console.error("Error loading spots:", error);
            }
        };

        loadData();
    }, [dispatch]); // Empty array ensures this runs only once on mount
    console.log("Spots in LandingPage:", spots);
    // Loading state (optional - remove if using skeleton/placeholder)
    if (spots.length === 0) return <div>Loading spots...</div>;

    return (
        <div className="spot-list">
            {spots.map(spot => (
                <SpotCard key={spot.id} spot={spot} />
            ))}
        </div>
    );
};

export default LandingPage;