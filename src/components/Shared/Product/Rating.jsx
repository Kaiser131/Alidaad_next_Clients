import { useState } from "react";
import { Star } from "lucide-react";

export default function Rating({
    max = 5,
    value = 0,
    onChange,
    size = 24,
    color = "#facc15",
    readOnly = false,
}) {
    const [rating, setRating] = useState(value);
    const [hover, setHover] = useState(null);

    const displayRating = hover !== null ? hover : rating;

    const handleClick = (val) => {
        if (readOnly) return;
        setRating(val);
        if (onChange) onChange(val);
    };

    return (
        <div className="flex gap-1">
            {[...Array(max)].map((_, i) => {
                const starValue = i + 1;

                // Calculate percentage fill for each star
                let fillPercent = 0;
                if (displayRating >= starValue) {
                    fillPercent = 100;
                } else if (displayRating + 1 > starValue) {
                    fillPercent = (displayRating - (starValue - 1)) * 100;
                }

                return (
                    <div
                        key={i}
                        className="relative cursor-pointer"
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => !readOnly && setHover(starValue)}
                        onMouseLeave={() => !readOnly && setHover(null)}
                        style={{ width: size, height: size }}
                    >
                        {/* Background star (gray) */}
                        <Star
                            size={size}
                            color="#d1d5db"
                            className="absolute top-0 left-0 pointer-events-none"
                        />

                        {/* Foreground filled star */}
                        <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{
                                width: `${fillPercent}%`,
                                height: "100%",
                            }}
                        >
                            <Star
                                size={size}
                                color={color}
                                fill={color}
                                className="pointer-events-none"
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
