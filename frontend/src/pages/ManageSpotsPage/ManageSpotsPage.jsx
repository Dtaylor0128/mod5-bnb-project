import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotCard from "../../components/ManageSpotCard/ManageSpotCard";
import { getAllSpotsThunk } from "../../store/spots";


const ManageSpotsPage = () => {
    const navigate = useNavigate();
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const currUserId = useSelector((state) => state.session.user?.id);
    const spots = useSelector((state) => state.spots);
    // filter spots after loading all spots
    const mySpots = Object.values(spots).filter((spot) => spot.ownerId === currUserId);

    // If no user is logged in, redirect to home page          
    useEffect(() => {
        if (!sessionUser) {
            navigate("/");
        }
    }, [sessionUser, navigate]);

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);

    return (
        <div className="manage-spots-page">
            <div className="header">
                <h1>Manage Spots</h1>
                {mySpots.length === 0 && (
                    <button onClick={() => navigate("/spots/new")}>Create a New Spot</button>
                )}
            </div>

            <div className="spot-grid">
                {mySpots.map((spot) => (
                    <ManageSpotCard key={spot.id} spot={spot} />
                ))}
            </div>
        </div>
    );
};

export default ManageSpotsPage;