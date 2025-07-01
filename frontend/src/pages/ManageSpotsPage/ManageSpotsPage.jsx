import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotCard from "../../components/ManageSpotCard/ManageSpotCard";
import { getAllSpotsThunk } from "../../store/spots";
import "./ManageSpotsPage.css";


const ManageSpotsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);

    // Get the current user from the session state
    //const sessionUser = useSelector((state) => state.session.user);
    //const currUserId = useSelector((state) => state.session.user?.id);
    //const sessionUser = currentUser || null; // Ensure sessionUser is null if no user
    const currentUser = useSelector((state) => state.session.user);
    const allspots = useSelector((state) => state.spots.allSpots || {});


    // If no user is logged in, redirect to home page          
    useEffect(() => {
        if (!currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    // fetch all spots on mount
    useEffect(() => {
        const loadSpots = async () => {
            await dispatch(getAllSpotsThunk());
            setIsLoaded(true);
        };
        loadSpots();
    }, [dispatch]);

    // Filter spots to get only those owned by the current user
    const userSpots = Object.values(allspots).filter(
        spot => spot && spot.ownerId === currentUser?.id
    );

    if (!currentUser) return null; // If no user, don't render the page

    if (!isLoaded) return <div className="loading">Loading your spots</div>; // Show loading state while fetching data


    return (
        <div className="manage-spots-page">
            {/*Heading with "Manage Spots" */}
            <h1 className="page-title">Manage Spots</h1>

            {/* "Create a New Spot" link if no spots */}
            {userSpots.length === 0 ? (
                <div className="no-spots-container">
                    <p>You haven&#39;t created any spots yet.</p>
                    <button
                        className="create-spot-link"
                        onClick={() => navigate("/spots/new")}
                    >
                        Create a New Spot
                    </button>
                </div>
            ) : (
                /* Spot tile list with Update/Delete buttons */
                <div className="spots-grid">
                    {userSpots.map(spot => (
                        <ManageSpotCard
                            key={spot.id}
                            spot={spot}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageSpotsPage;