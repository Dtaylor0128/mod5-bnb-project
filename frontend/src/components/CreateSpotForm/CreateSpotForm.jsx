import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { createNewSpotThunk } from "../../store/spots"
import { createSpotImageThunk } from "../../store/images"
import "./CreateSpotForm.css"

const CreateSpotForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [country, setCountry] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [previewImage, setPreviewImage] = useState('')
    const [imageUrl1, setImageUrl1] = useState("");
    const [imageUrl2, setImageUrl2] = useState("");
    const [imageUrl3, setImageUrl3] = useState("");
    const [imageUrl4, setImageUrl4] = useState("");
    const [formErrors, setFormErrors] = useState({})
    const [hasSubmitted, setHasSubmitted] = useState(false)

    useEffect(() => {
        const errors = {};
        if (hasSubmitted) {
            if (!country) errors.country = 'Country is required';
            if (!address) errors.address = 'Street address is required';
            if (!city) errors.city = 'City is required';
            if (!state) errors.state = 'State is required';
            if (!description || description.length < 30) errors.description = 'Description needs 30 or more characters';
            if (!name) errors.name = 'Name is required';
            if (!price) errors.price = 'Price per night is required';
            if (!lat || lat < -90 || lat > 90) errors.lat = 'Latitude is required must be within -90 and 90.';
            if (!lng || lng < -180 || lng > 180) errors.lng = 'Longitude is required must be within -180 and 180.';
            if (!previewImage) errors.previewImage = 'Preview image is required';
            if (imageUrl1 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl1)) errors.imageUrl1 = 'Image URL must end in .png .jpg or .jpeg';
            if (imageUrl2 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl2)) errors.imageUrl2 = 'Image URL must end in .png .jpg or .jpeg';
            if (imageUrl3 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl3)) errors.imageUrl3 = 'Image URL must end in .png .jpg or .jpeg';
            if (imageUrl4 && !/\.jpg|\.jpeg|\.png$/i.test(imageUrl4)) errors.imageUrl4 = 'Image URL must end in .png .jpg or .jpeg';
        }
        setFormErrors(errors);
    }, [hasSubmitted, country, address, city, state, description, name, price, lat, lng, previewImage, imageUrl1, imageUrl2, imageUrl3, imageUrl4]);


    const handleSubmit = async (e) => {
        setHasSubmitted(true);
        e.preventDefault();

        const spotData = {
            address,
            city,
            state,
            country,
            lat: Number(lat),
            lng: Number(lng),
            name,
            description,
            price
        };

        const newSpot = await dispatch(createNewSpotThunk(spotData));
        if (newSpot && newSpot.id) {
            // Prepare all image uploads
            const imagePromises = [
                dispatch(createSpotImageThunk(newSpot.id, {
                    url: previewImage,
                    preview: true
                }))
            ];
            [imageUrl1, imageUrl2, imageUrl3, imageUrl4].forEach(url => {
                if (url) imagePromises.push(
                    dispatch(createSpotImageThunk(newSpot.id, {
                        url,
                        preview: false
                    }))
                );
            });
            await Promise.all(imagePromises);
            navigate(`/spots/${newSpot.id}`);
        } else {
            console.error('Spot creation failed:', newSpot);
        }


    };
    // Reset form on mount/unmount
    useEffect(() => {
        return () => {
            setCountry('');
            setAddress('');
            setCity('');
            setState('');
            setDescription('');
            setName('');
            setPrice('');
            setLat('');
            setLng('');
            setPreviewImage('');
            setImageUrl1('');
            setImageUrl2('');
            setImageUrl3('');
            setImageUrl4('');
            setFormErrors({});
            setHasSubmitted(false);
        };
    }, []);

    return (
        <div className="create-spot-form-container">
            <h1 className="title">Create a New Spot</h1>
            <form onSubmit={handleSubmit} className="long-forms">
                <div className="form-section">
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <div className="form-group">
                        <label>Country</label>
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        {formErrors.country && <p className="error">{formErrors.country}</p>}
                    </div>

                    <div className="form-group">
                        <label>Street Address</label>
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {formErrors.address && <p className="error">{formErrors.address}</p>}
                    </div>
                    <div className="location">

                        <div className="form-group">
                            <label>City</label>
                            <input className="cityInput"
                                type="text"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                            {formErrors.city && <p className="error">{formErrors.city}</p>}
                        </div>
                        <div className="CityState"><label></label><br /><br />,</div><span></span>

                        <div className="form-group">
                            <label>State</label>
                            <input className="stateInput"
                                type="text"
                                placeholder="State"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />
                            {formErrors.state && <p className="error">{formErrors.state}</p>}
                        </div>
                    </div>
                </div>

                <div>
                    <label>Latitude</label>
                    <input
                        type="text"
                        step="any"
                        placeholder="Latititude must be within -90 and 90 "
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                    />
                    {formErrors.lat && <p className="error">{formErrors.lat}</p>}
                </div>

                <div>
                    <label>Longitude</label>
                    <input
                        type="text"
                        step="any"
                        placeholder="Longitude must be within -180 and 180"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                    />
                    {formErrors.lng && <p className="error">{formErrors.lng}</p>}
                </div>

                <div className="form-section">
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            placeholder="Please write at least 30 characters"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {formErrors.description && <p className="error">{formErrors.description}</p>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Name of your spot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {formErrors.name && <p className="error">{formErrors.name}</p>}
                    </div>
                </div>

                <div className="form-section">
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <div className="form-group">
                        <label>Price per night (USD)</label>
                        <div className="price"> <span>$</span>
                            <input
                                type="number"
                                placeholder="Price per night (USD)"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            {formErrors.price && <p className="error">{formErrors.price}</p>}
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <div className="form-group">

                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                        />
                        {formErrors.previewImage && <p className="error">{formErrors.previewImage}</p>}
                    </div>
                    <br />
                    <div className="form-group">

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl1}
                            onChange={(e) => setImageUrl1(e.target.value)}
                        />
                        {formErrors.imageUrl1 && <p className="error">{formErrors.imageUrl1}</p>}
                    </div>
                    <br />
                    <div className="form-group">

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl2}
                            onChange={(e) => setImageUrl2(e.target.value)}
                        />
                        {formErrors.imageUrl2 && <p className="error">{formErrors.imageUrl2}</p>}
                    </div>
                    <br />
                    <div className="form-group">

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl3}
                            onChange={(e) => setImageUrl3(e.target.value)}
                        />
                        {formErrors.imageUrl3 && <p className="error">{formErrors.imageUrl3}</p>}
                    </div>
                    <br />
                    <div className="form-group">

                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrl4}
                            onChange={(e) => setImageUrl4(e.target.value)}
                        />
                        {formErrors.imageUrl4 && <p className="error">{formErrors.imageUrl4}</p>}
                    </div>
                    <br />

                </div>

                <button type="submit" disabled={Object.keys(formErrors).length > 0 && hasSubmitted}>Create Spot</button>
                {/* {formErrors && <p>{formErrors}</p>} */}
            </form>
        </div>
    )
}
export default CreateSpotForm