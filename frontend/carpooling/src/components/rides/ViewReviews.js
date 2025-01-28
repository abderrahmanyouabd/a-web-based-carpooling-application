import React from "react";
import RenderStars from "./RenderStars";
import { useLocation } from "react-router-dom";

const ViewReviews = () => {

    const location = useLocation();
    const { driverName } = location.state;
    
    // Dummy review data
    const reviews = [
        {
            id: 1,
            name: "John Doe",
            rating: 4.5,
            comment: "Great driver! Very friendly and punctual.",
            date: "January 20, 2025"
        },
        {
            id: 2,
            name: "Jane Smith",
            rating: 5,
            comment: "The ride was smooth, and the driver was very professional!",
            date: "January 15, 2025"
        },
        {
            id: 3,
            name: "Michael Johnson",
            rating: 4,
            comment: "Good experience overall, but could improve communication.",
            date: "January 10, 2025"
        }
    ];

    return (
        <div className="p-6 flex flex-col justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Reviews for {driverName} </h1>
            <div className="space-y-6 mt-10">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition duration-200"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{review.name}</h2>
                            <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="mt-2">{RenderStars(review.rating)}</div>
                        <p className="mt-3text-gray-700">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewReviews;