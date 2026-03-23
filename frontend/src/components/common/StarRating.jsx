import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function StarRating({ rating = 0, max = 5, size = 18 }) {
    const normalizedRating = Math.max(0, Math.min(Number(rating) || 0, max));

    const stars = Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;

        if (normalizedRating >= starValue) {
            return <FaStar key={starValue} size={size} />;
        }

        if (normalizedRating >= starValue - 0.5) {
            return <FaStarHalfAlt key={starValue} size={size} />;
        }

        return <FaRegStar key={starValue} size={size} />;
    });

    return (
        <span
            className="d-inline-flex align-items-center gap-1"
            style={{ color: "#f5b301" }}
            title={`${normalizedRating} out of ${max}`}
            aria-label={`${normalizedRating} out of ${max} stars`}
        >
            {stars}
        </span>
    );
}

export default StarRating;
