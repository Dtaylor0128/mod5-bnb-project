import { FaStar } from "react-icons/fa";
import "./SpotInfo.css";

const SpotInfo = ({ spotDetails = {} }) => {
    const {
        Owner = {},
        SpotImages = [],
        avgStarRating = null,
        city = "",
        country = "",
        description = "",
        name = "",
        numReviews = 0,
        price = "",
        state = ""
    } = spotDetails;

    const previewImage = spotDetails?.SpotImages?.find(img => img.preview)?.url || spotDetails?.previewImage;
    const nonPreviewImages = SpotImages.filter(img => !img.preview);

    const handleClick = () => {
        alert('Feature Coming Soon...')
    };

    return (
        <div className="page">
            <h2 className="spot-title">{name}</h2>
            <p className="spot-location">{city}, {state}, {country}</p>
            <div className="spot-images">
                {previewImage && (
                    <img
                        key="preview"
                        src={previewImage}
                        className="large-image"
                        alt={spotDetails?.name}
                    />
                )}
                {nonPreviewImages.map((image, index) => (
                    <img
                        key={image.id}
                        src={image.url}
                        className="small-image"
                        alt={`Spot ${index + 1}`}
                    />
                ))}
            </div>
            <div className="details-callout-wrapper">
                <div className="details-container">
                    <div className="details-text">
                        <h2 className="spot-host">
                            Hosted by {Owner.firstName} {Owner.lastName}
                        </h2>
                        <p className="spot-description">{description}</p>
                    </div>
                </div>
                <div className="callout-container">
                    <div className="callout-text">
                        <span className="callout-price">${price} night</span>
                        <p className="callout-rating">
                            <FaStar />
                            {avgStarRating ? avgStarRating.toFixed(1) : "New"}
                            {numReviews > 0 && <> ・{numReviews} {numReviews === 1 ? "review" : "reviews"}</>}
                        </p>
                    </div>
                    <div className="button-container">
                        <button className="button" onClick={handleClick}>
                            Reserve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotInfo;
