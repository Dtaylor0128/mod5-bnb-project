import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateSpotThunk, getSpotThunk } from "../../store/spots";
import { createSpotImageThunk, deleteSpotImageThunk } from "../../store/images";
import "./UpdateSpotPage.css";


const UpdateSpotForm = () => {
    // decalare spotId first before using
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const spot = useSelector((state) => state.spots.allSpots?.[spotId]);


    // Solution consolidate image URLs in state, not the entire image data
    const [images, setImages] = useState({
        preview: "",
        others: ["", "", "", ""]
    });

    // form state variables
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    // This will hold the preview image URL however, large image data stored in state Problem
    // const [previewImage, setPreviewImage] = useState("");
    // const [imageUrl1, setImageUrl1] = useState("");
    // const [imageUrl2, setImageUrl2] = useState("");
    // const [imageUrl3, setImageUrl3] = useState("");
    // const [imageUrl4, setImageUrl4] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);


    //fetch the spot details when the component mounts or when spotId changes
    useEffect(() => {
        if (spotId) {
            dispatch(getSpotThunk(spotId));
        }
    }, [dispatch, spotId]);

    // populate form fields with existing spot data when spot is fetched
    useEffect(() => {
        if (spot) {
            setCountry(spot.country || "");
            setAddress(spot.address || "");
            setCity(spot.city || "");
            setState(spot.state || "");
            setDescription(spot.description || "");
            setName(spot.name || "");
            setPrice(spot.price !== undefined ? spot.price : "");
            setLat(spot.lat || 0);
            setLng(spot.lng || 0);


            // intialize images state with existing spot images
            if (spot.SpotImages?.length > 0) {
                const previewImage = spot.SpotImages.find((img) => img.preview);
                const otherImages = spot.SpotImages.filter((img) => !img.preview);

                setImages({
                    preview: previewImage?.url || "",
                    others: [
                        otherImages[0]?.url || "",
                        otherImages[1]?.url || "",
                        otherImages[2]?.url || "",
                        otherImages[3]?.url || ""
                    ]
                });
            }


            // if (spot.SpotImages && spot.SpotImages.length > 0) {
            //     const preview = spot.SpotImages.find((img) => img.preview === true);
            //     const nonPreviewImages = spot.SpotImages.filter((img) => img.preview === false);

            //     setPreviewImage(preview?.url || "");
            //     setImageUrl1(nonPreviewImages[0]?.url || "");
            //     setImageUrl2(nonPreviewImages[1]?.url || "");
            //     setImageUrl3(nonPreviewImages[2]?.url || "");
            //     setImageUrl4(nonPreviewImages[3]?.url || "");
            // }
        }
    }, [spot]);

    // update image state
    const handleImageChange = (index, url) => {
        // const newImages = { ...images };
        // if (index === -1) newImages.preview = url;
        // else newImages.others[index] = url;
        // setImages(newImages);
        setImages(prev => {
            const newImages = { ...prev };
            if (index === -1) newImages.preview = url;
            else newImages.others[index] = url;
            return newImages;
        });
    };


    // useEffect(() => {
    //     return () => {
    //         if (images.preview) URL.revokeObjectURL(images.preview);
    //         images.others.forEach(url => url && URL.revokeObjectURL(url));
    //     };
    // }, [images]);


    // validate form fields when hasSubmitted changes
    useEffect(() => {
        const errors = {};
        if (hasSubmitted) {
            if (!country) errors.country = "Country is required";
            if (!address) errors.address = "Street address is required";
            if (!city) errors.city = "City is required";
            if (!state) errors.state = "State is required";
            if (!description || description.length < 30) errors.description = "Description needs a minimum of 30 characters";
            if (!name) errors.name = "Name is required";
            if (!price || price <= 0) errors.price = "Price must be a postive number";
            if (isNaN(lat) || lat < -90 || lat > 90) errors.lat = "Latitude is must be within -90 and 90.";
            if (isNaN(lng) || lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180.";
            //if (!previewImage) errors.previewImage = "Preview image is required";
            // if (imageUrl1 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl1)) errors.imageUrl1 = "Image URL must end in .png .jpg or .jpeg";
            // if (imageUrl2 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl2)) errors.imageUrl2 = "Image URL must end in .png .jpg or .jpeg";
            // if (imageUrl3 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl3)) errors.imageUrl3 = "Image URL must end in .png .jpg or .jpeg";
            // if (imageUrl4 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl4)) errors.imageUrl4 = "Image URL must end in .png .jpg or .jpeg";

            //image validation for state urls    
            if (!images.preview) errors.previewImage = "Preview image is required";

            images.others.forEach((url, index) => {
                if (url && !/\.jpg|\.jpeg|\.png$/i.test(url)) {
                    errors[`imageUrl${index + 1}`] = `Image  must end in .png, .jpg, or .jpeg`;
                }
            });

            setFormErrors(errors);
        }
    }, [hasSubmitted, country, address, city, state, description, name, price, lat, lng, images]);

    // handle form submission
    // This function will be called when the form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (Object.keys(formErrors).length > 0) return;

        const spotData = {
            id: spotId,
            address,
            city,
            state,
            country,
            lat: Number(lat),
            lng: Number(lng),
            name,
            description,
            price: Number(price),
        };

        try {
            // Update spot details
            const updatedSpot = await dispatch(updateSpotThunk(spotData));

            if (updatedSpot) {
                // Get current spot images
                const currentImages = spot.SpotImages || [];

                // Update preview image if changed
                const currentPreview = currentImages.find(img => img.preview);
                if (currentPreview?.url !== images.preview) {
                    if (currentPreview) {
                        try {
                            await dispatch(deleteSpotImageThunk(currentPreview.id));
                        } catch (error) {
                            console.error("Error deleting old preview:", error);
                        }
                    }
                    if (images.preview) {
                        await dispatch(createSpotImageThunk(spotId, {
                            url: images.preview,
                            preview: true
                        }));
                    }
                }

                // Update other images
                const nonPreviewImages = currentImages.filter(img => !img.preview);

                // Delete only removed images
                for (const img of nonPreviewImages) {
                    if (!images.others.includes(img.url)) {
                        try {
                            await dispatch(deleteSpotImageThunk(img.id));
                        } catch (error) {
                            console.error(`Error deleting image ${img.id}:`, error);
                        }
                    }
                }

                // Add new images
                for (const url of images.others) {
                    if (url && !nonPreviewImages.some(img => img.url === url)) {
                        try {
                            await dispatch(createSpotImageThunk(spotId, {
                                url,
                                preview: false
                            }));
                        } catch (error) {
                            console.error("Error creating new image:", error);
                        }
                    }
                }

                navigate(`/spots/${spotId}`);
            }
        } catch (error) {
            console.error("Update failed:", error);
        }
    };


    if (!spot) { return <div className="loading">Loading spot details...</div>; }

    return (
        <div className="update-spot-form-container">
            <h1>Update Your Spot</h1>
            <form onSubmit={handleSubmit} className="long-forms">
                <div className="form-section">
                    <h2>Where&apos;s your place located?</h2>
                    <p>Only Guests will only get your exact address once they booked a reservation.</p>
                    <div className="form-group">
                        <label htmlFor="country-input">Country</label>
                        <input
                            id="country-input"
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            aria-label="Country"
                            aria-required="true"
                            aria-describedby={formErrors.country ? "country-error" : undefined}
                        />
                        {formErrors.country && <p id="country-error" className="error" aria-live="polite">{formErrors.country}</p>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address-input">Street Address</label>
                        <input
                            id="address-input"
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            aria-label="Address"
                            aria-required="true"
                            aria-describedby={formErrors.address ? "address-error" : undefined}
                        />
                        {formErrors.address && <p id="address-error" className="error" aria-live="polite">{formErrors.address}</p>}

                    </div>
                    <div className="location">

                        <div className="form-group CityState">
                            <label htmlFor="city-input">City</label>
                            <input
                                id="city-input"
                                className="cityInput"
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                aria-label="City"
                                aria-required="true"
                                aria-describedby={formErrors.city ? "city-error" : undefined}
                            />
                            {formErrors.city && <p id="city-error" className="error" aria-live="polite">{formErrors.city}</p>}
                        </div>

                        <div className="CityState"><label></label><br /><br />,</div><span></span>

                        <div className="form-group CityState">
                            <label htmlFor="state-input">State</label>
                            <input
                                id="state-input"
                                className="stateInput"
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                aria-label="State"
                                aria-required="true"
                                aria-describedby={formErrors.state ? "state-error" : undefined}
                            />
                            {formErrors.state && <p id="state-error" className="error" aria-live="polite">{formErrors.state}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="lat-input">Latitude</label>
                    <input
                        id="lat-input"
                        type="text"
                        placeholder="Latitude"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        aria-label="Latitude"
                        aria-required="true"
                        aria-describedby={formErrors.lat ? "lat-error" : undefined}
                    />
                    {formErrors.lat && <p id="lat-error" className="error" aria-live="polite">{formErrors.lat}</p>}
                </div>

                <div>
                    <label htmlFor="lng-input">Longitude</label>
                    <input
                        id="lng-input"
                        type="text"
                        placeholder="Longitude"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        aria-label="Longitude"
                        aria-required="true"
                        aria-describedby={formErrors.lng ? "lng-error" : undefined}
                    />
                    {formErrors.lng && <p id="lng-error" className="error" aria-live="polite">{formErrors.lng}</p>}
                </div>

                <div className="form-section">
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities or nearby activities.</p>
                    <div className="form-group">
                        <label htmlFor="descrpition-input">Description</label>
                        <textarea
                            id="description-input"
                            placeholder={spot.description}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            aria-label="Description"
                            aria-required="true"
                            aria-describedby={formErrors.description ? "description-error" : undefined}
                        />
                        {formErrors.description && <p id="description-error" className="error" aria-live="polite">{formErrors.description}</p>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Create a title for your spot</h2>
                    <p>what makes this place special? Think of something catchy and easy to remember.</p>
                    <div className="form-group">
                        <label htmlFor="name-input">Name</label>
                        <input
                            id="name-input"
                            type="text"
                            placeholder={spot.name}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-label="Name"
                            aria-required="true"
                            aria-describedby={formErrors.name ? "name-error" : undefined}
                        />
                        {formErrors.name && <p id="name-error" className="error" aria-live="polite">{formErrors.name}</p>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className="form-group">
                        <label htmlFor="price-input">Price per night (USD)</label>
                        <div className="price"> <span>$</span>
                            <input
                                id="price-input"
                                type="number"
                                placeholder={spot.price}
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                aria-label="Price"
                                aria-required="true"
                                aria-describedby={formErrors.price ? "price-error" : undefined}
                            />
                            {formErrors.price && <p id="price-error" className="error" aria-live="polite">{formErrors.price}</p>}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Bring life to your spot with photos</h2>
                    <p>Submit at least one photo to publish your spot.</p>
                    {/* Preview Image */}
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={images.preview}
                            onChange={(e) => handleImageChange(-1, e.target.value)}
                            aria-label="Preview Image URL"
                        />
                        {images.preview && (
                            <img
                                src={images.preview}
                                alt="Preview"
                                className="preview-image"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                }}
                            />
                        )}
                        {formErrors.previewImage && <p className="error">{formErrors.previewImage}</p>}
                    </div>
                    <br />
                    {/*other images*/}
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder={`Image URL ${index + 1}`}
                                value={images.others[index]}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                                aria-label={`Image URL ${index + 1}`}
                            />
                            {images.others[index] && (
                                <img
                                    src={images.others[index]}
                                    alt={`Preview ${index + 1}`}
                                    style={{ width: '150px', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                                    className="other-image-preview"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                    }}
                                />
                            )}
                            {formErrors[`imageUrl${index + 1}`] && (
                                <p className="error">{formErrors[`imageUrl${index + 1}`]}</p>
                            )}
                        </div>
                    ))}


                    <br />

                </div>

                <button type="submit">Update your Spot</button>
            </form>
        </div>
    );
};

export default UpdateSpotForm;