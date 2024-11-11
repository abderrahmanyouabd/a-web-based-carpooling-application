import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import html2pdf from "html2pdf.js";

const TripConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { rideId } = useParams();
    const token = localStorage.getItem('jwtToken');

    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                if (!token) {
                    navigate("/signin");
                    return;
                }

                console.log("Ride Id: ", rideId);

                let url = `http://localhost:8080/api/trips/${rideId}`;

                console.log("Fetched backend Url: " + url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTripDetails(data);
                } else {
                    console.error("Failed to fetch trip details.");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };

        fetchTripDetails();
    }, [rideId, token, navigate]);

    const handleDownloadReceipt = () => {
        const element = document.getElementById("receipt");
        html2pdf()
            .from(element)
            .save(`trip_receipt_${rideId}.pdf`);
    };

    if (!tripDetails) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-green-600 mb-6">
                You have Successfully joined the trip with {tripDetails.driver.fullName}!
            </h1>
            <div id="receipt" className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full space-y-4">
                
                <h2 className="text-2xl font-semibold text-center mb-4">Trip Confirmation Receipt</h2>
                <div>
                    <h3 className="font-semibold">Driver Information: </h3>
                    <p>Name: {tripDetails.driver.fullName}</p>
                    <p>Email: {tripDetails.driver.email}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Trip Details:</h3>
                    <p>Leaving From: {tripDetails.leavingFrom.name}</p>
                    <p>Going To: {tripDetails.goingTo.name}</p>
                    <p>Departure Date: {tripDetails.date}</p>
                    <p>Departure Time: {tripDetails.time}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Payment Details:</h3>
                    <p>Fare per Seat: ${tripDetails.farePerSeat.toFixed(2)}</p>
                    <p>Seats Booked: 1</p>
                    <p>Total Amount: ${(tripDetails.farePerSeat*1).toFixed(2)}</p>
                </div>
            </div>
            <button 
                onClick={handleDownloadReceipt}
                className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Download Receipt as PDF
            </button>
        </div>
    );
};

export default TripConfirmation;