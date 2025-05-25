
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { getSpotsThunk } from '../../store/spots';

const Splash = () => {
    // hooks
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    // go to backend -> trigger that our load is complete
    useEffect(() => {
        const getSpots = async () => {
            await dispatch(getSpotsThunk());
            setIsLoaded(true);
        };

        if (!isLoaded) {
            getSpots();
        }
    }, [dispatch, isLoaded]);

    if (!isLoaded) {
        return (
            <img
                src="https://cdnl.iconscout.com/lottie/premium/thumb/loading-5325468-4450387.gif" //not the official way to do this just need to make sure it works
                style={{ height: '100px', width: '100px' }}
                alt="Loading..."
            />
        );
    } else {
        return (
            <div>
                <h1>Welcome to RanchBnb</h1>
            </div>
        );
    }
}

export default Splash;