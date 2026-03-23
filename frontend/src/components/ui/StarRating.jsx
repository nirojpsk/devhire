import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

function StarRating({ rating = 0, max = 5, size = 16, showValue = false, className = "" }) {
    const normalizedRating = Math.max(0, Math.min(Number(rating) || 0, max));

    const stars = Array.from({ length: max }, (_, index) => {
        const value = index + 1;

        if (normalizedRating >= value) {
            return <FaStar key={value} size={size} />;
        }

        if (normalizedRating >= value - 0.5) {
            return <FaStarHalfAlt key={value} size={size} />;
        }

        return <FaRegStar key={value} size={size} />;
    });

    return (
        <span
            className={["rating-stars", className].filter(Boolean).join(" ")}
            title={`${normalizedRating} out of ${max}`}
            aria-label={`${normalizedRating} out of ${max} stars`}
        >
            <span className="rating-stars__icons">{stars}</span>
            {showValue ? <span className="rating-stars__value">{normalizedRating.toFixed(1)}</span> : null}
        </span>
    );
}

export default StarRating;
