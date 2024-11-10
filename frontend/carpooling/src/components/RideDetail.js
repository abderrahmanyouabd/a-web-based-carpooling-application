import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaCar, FaCheckCircle, FaBan, FaUserFriends, FaClock, FaShieldAlt } from "react-icons/fa";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const RideDetail = () => {
    const location = useLocation();
    const [profileData, setProfileData] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false);

    const ride = location.state?.ride;
    const stripe = useStripe();
    const elements = useElements();

    console.log("Ride: ", ride);

    const formattedDate = (date) => date.replace("T", " ");

    useEffect(() => {
        // Fetch user profile data
        const fetchProfileData = async () => {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.log("No token found, redirecting to login page.");
                return;
            }
            const response = await fetch(`http://localhost:8080/api/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProfileData(data);
            } else {
                console.error("Failed to fetch profile data");
            }
        };

        fetchProfileData();
    }, []);

    const fetchPaymentIntent = async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                console.log("No token found, redirecting to login page.");
                return;
            }

            const response = await fetch(`http://localhost:8080/api/trips/${ride.id}/pay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rideId: ride.id,
                }),
            });

            if (response.ok) {
                const clientSecret = await response.text();
                setClientSecret(clientSecret);
            } else {
                console.error("Failed to fetch client secret.");
            }
        } catch (error) {
            console.error("Error fetching client secret:", error);
        }
    };

    const handlePaymentClick = async () => {
        if (paymentInitiated) return;

        setPaymentInitiated(true);
        await fetchPaymentIntent();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            console.log("Stripe or elements are not loaded, or clientSecret is missing.");
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (error) {
                console.error("Payment failed:", error);
                setLoading(false);
            } else if (paymentIntent.status === 'succeeded') {
                console.log("Payment succeeded!");

                console.log("Attempting to join the ride...");
                await joinRide();
            }
        } catch (error) {
            console.error("Error confirming payment:", error);
            setLoading(false);
        }
    };

    const joinRide = async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            console.log("No token found, cannot join ride.");
            return;
        }

        try {
            console.log("Joining trip with ride ID:", ride.id);
            const joinResponse = await axios.put(
                `http://localhost:8080/api/trips/${ride.id}/join`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (joinResponse.status === 200) {
                console.log("Successfully joined the ride!");
            } else {
                console.error("Error joining the ride, status:", joinResponse.status);
            }
        } catch (err) {
            console.error("Error joining the trip:", err);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100 flex flex-col lg:flex-row items-center lg:justify-center space-y-6 lg:space-y-0 lg:space-x-16">
            <div className="w-full max-w-3xl space-y-6">
                {/* Header */}
                <h1 className="text-3xl font-semibold text-gray-800 text-center lg:text-left">
                    {formattedDate(ride.leavingFrom.departureTime)}
                </h1>

                {/* Ride Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-bold">{ride.leavingFrom.name}</h2>
                            <p className="text-gray-500">{formattedDate(ride.leavingFrom.departureTime)}</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{ride.goingTo.name}</h2>
                            <p className="text-gray-500">{formattedDate(ride.goingTo.arrivalTime)}</p>
                        </div>
                    </div>
                </div>

                {/* Driver and Vehicle Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-start space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {profileData?.profilePicture ? (
                                <img
                                    src={`data:image/jpeg;base64,${profileData.profilePicture}`}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-gray-500 text-sm">Profile Picture</span>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold">{ride.driver.fullName}</h3>
                    </div>

                    <div className="space-y-2 text-gray-600 text-lg">
                        <div className="flex items-center space-x-2">
                            <FaCheckCircle className="text-blue-500"/>
                            <span>Verified Profile</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaShieldAlt className="text-gray-500"/>
                            <span>Rarely cancels rides</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaClock className="text-gray-500"/>
                            <span>Instant booking confirmation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaUserFriends className="text-gray-500"/>
                            <span>Max. 2 in the back</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaBan className="text-gray-500"/>
                            <span>No smoking, please</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaCar className="text-gray-500"/>
                            <span>{ride.vehicle.model} - {ride.vehicle.color} - {ride.vehicle.licensePlateNumber}</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-center mt-4">
                        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-150">
                            Contact {ride.driver.fullName}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Form */}
            {clientSecret && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
                    <h2 className="text-2xl font-semibold text-center lg:text-left">Payment Details</h2>
                    <CardElement className="border p-3 rounded-md"/>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-150"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm Payment"}
                    </button>
                </form>
            )}

            {/* Proceed to Payment Button */}
            <div className="w-full flex justify-center mt-6 lg:mt-0">
                <button
                    className="px-8 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-150"
                    onClick={handlePaymentClick}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );

};

export default RideDetail;