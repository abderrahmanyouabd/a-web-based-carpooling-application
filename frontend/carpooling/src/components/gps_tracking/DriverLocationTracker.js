import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import MapRouteDrawing from "./MapRouteDrawing";

const socket = io("http://localhost:3001");

const DriverLocationTracker = () => {
    const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [tracking, setTracking] = useState(false);
    const { rideId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('jwtToken');
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                if (!token) {
                    console.log("User is not logged in. Navigating to sign in page...");
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
                    console.log("Data: ", data);
                } else {
                    console.error("Failed to fetch trip details.");
                }
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };


        fetchTripDetails();
    }, [rideId, token]);

    useEffect(() => {
        if (tracking && navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition({ latitude, longitude });

                    socket.emit("driverLocationUpdate", {
                        rideId: rideId,
                        latitude: latitude,
                        longitude: longitude,
                    });
                    console.log("Ride Location updated: ", rideId, latitude, longitude);
                },
                (error) => {
                    console.error("Error retriving location: ", error);
                },
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000}
            );

            return () => navigator.geolocation.clearWatch(watchId);
            
        }
    }, [tracking])

    const handleStartTracking = () => setTracking(true);
    const handleStopTracking = () => setTracking(false);

    const startCoordinates = tripDetails && [parseFloat(tripDetails.leavingFrom.longitude), parseFloat(tripDetails.leavingFrom.latitude)];
    const endCoordinates = tripDetails && [parseFloat(tripDetails.goingTo.longitude), parseFloat(tripDetails.goingTo.latitude)];
    const driverPosition = position.latitude && position.longitude ? [position.longitude, position.latitude] : null;

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Driver Location Tracker</h2>

            {/* {position.latitude && position.longitude && (
                <p className="text-lg text-gray-700 mb-4">
                    Your current location is:
                    <br />
                    Latitude: {position.latitude}
                    <br />
                    Longitude: {position.longitude}
                </p>
            )} */}

            <div className="w-full max-w-3xl mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Driver Location</h3>
                {position.latitude && position.longitude ? (
                    <MapRouteDrawing startCoordinates={startCoordinates} endCoordinates={endCoordinates} driverPosition={driverPosition}/>
                ) : (
                    <p className="text-gray-500">Please enable your location tracking to view your current location.</p>
                )}

                {tracking && !position.latitude && !position.longitude && (
                    <p className="text-gray-500">Fetching your current location...</p>
                )}

                {!tracking && position.latitude && position.longitude && (
                    <p className="text-gray-500">Tracking has been stopped</p>
                )}

            </div>

            <div className="space-y-4 mt-4 flex flex-col items-center md:justify-center md:flex-row md:space-x-4 md:space-y-0">
                <button
                    onClick={handleStartTracking}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                    Start Tracking Location
                </button>
                <button 
                    onClick={handleStopTracking}
                    className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                >
                    Stop Tracking Location
                </button>
            </div>
        </div>
    )
}

export default DriverLocationTracker;