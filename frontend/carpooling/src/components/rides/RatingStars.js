import React from "react";
import { Star } from "lucide-react";

const RatingStars = ({ rating, setRating }) => {
    return (
        <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
                <Star 
                    key={value}
                    className={`cursor-pointer ${value <= rating ? "text-yellow-500" : "text-gray-300"}`}
                    onClick={() => setRating(value)}
                    size={24}
                    fill={value <= rating ? "currentColor" : "none"}
                />
            ))}
        </div>
    )
}

export default RatingStars;