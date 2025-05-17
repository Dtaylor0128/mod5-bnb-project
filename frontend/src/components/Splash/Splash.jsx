import React, { useEffect } from "react";

const Splash = () => {
    // hooks
    const dispatch = useDispatch();

    const [isLoaded, setIsLoaded] = useState(false);

    // go to backend -> trigger that our load is complete

    useEffect(() => {
        // step 2
        const getSpots = async () => {
            // go to our backend -> via thunk!!
            await dispatch(getSpotsThunk());
        }


        if (!isLoaded) {
            getSpots();
        }

    }, [isLoaded])




    if (!isLoaded) {
        return //<img src="https://cdnl.iconscout.com/lottie/premium/thumb/loading-5325468-4450387.gif" {{ height: '100px', width: '100px' }} /> //not the official way to do this just need to make sure it works
    } else {
        return (
            <div>
                <h1>Welcome to RanchBnb</h1>
            </div>

        );
    }
}

export default Splash;