import React, { useState } from "react";
import RenderStars from "./RenderStars";
import { useLocation } from "react-router-dom";
import { FaRegSadCry } from "react-icons/fa";

// Dummy review data
const dummyReviews = [
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
    },
    {
        id: 4,
        name: "Michael Johnson",
        rating: 4,
        comment: "Good experience overall, but could improve communication.",
        date: "January 10, 2025"
    },
    {
        id: 5,
        name: "Michael Johnson",
        rating: 4,
        comment: "Good experience overall, but could improve communication.",
        date: "January 10, 2025"
    },
    {
        id: 6,
        name: "Michael Johnson",
        rating: 4,
        comment: "Good experience overall, but could improve communication.",
        date: "January 10, 2025"
    },
    {
        id: 7,
        name: "Michael Johnson",
        rating: 4,
        comment: "Good experience overall, but could improve communication.",
        date: "January 10, 2025"
    }
];

const ViewReviews = ({ user }) => {
    const location = useLocation();
    const { driverName } = location.state;
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState(dummyReviews);

    const handleSubmitReview = () => {
        if (rating < 1 || rating > 5 || comment.trim() === ""){
            alert("Please enter a valid rating(1-5) and a comment");
            return;
        }

        const newReview = {
            id: reviews.length + 1,
            name: user.fullName,
            rating: rating,
            comment: comment,
            date: new Date().toLocaleDateString()
        }

        setReviews([...reviews, newReview]);
        setShowReviewForm(false);
        setRating(0);
        setComment("");
    }

    

    return (
        <div className="p-6 flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Reviews for {driverName || "this driver"}
            </h1>
            <div className="mb-4">
                <button
                    onClick={() => setShowReviewForm((prev) => !prev)}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Leave a Review
                </button>
            </div>
            {showReviewForm && (
                <div className="w-full max-w-xl bg-gray-100 p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-lg font-semibold text-gray-700">Write a Review</h2>
                    <div className="mt-2">
                        <p className="text-gray-600">Reviewer: <span className="font-semibold">{user.fullName}</span></p>
                        <p className="text-gray-600">Date: <span className="font-semibold">{new Date().toLocaleDateString()}</span></p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium">Rating:</label>
                        <input 
                            type="number"
                            min="1" 
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium">Comment:</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="mt-1 p-2 w-full border rounded-md h-24"
                            placeholder="Share your experience..."
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleSubmitReview}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
                        >
                            Submit Review
                        </button>
                        <button 
                            onClick={() => setShowReviewForm(false)}
                            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="flex flex-col items-center mt-3 text-gray-500">
                    <FaRegSadCry className="w-32 h-32 mb-3" />
                    <h2 className="mt-4 text-lg font-semibold text-gray-700 text-center px-4 break-words">
                        Unfortunately, there is no review <br/> for {driverName} yet
                    </h2>
                    <p className="mt-2 text-gray-500">Be the first to leave a review!</p>
                </div>
            ) : (
                <div className="space-y-6 mt-3 max-w-2xl w-full overflow-y-auto max-h-[700px] p-2">

                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-5 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-200 bg-white"
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
            )}

            
        </div>
    );
}

export default ViewReviews;