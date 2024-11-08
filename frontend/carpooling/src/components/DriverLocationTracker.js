import React, { useEffect, useState } from "react";
import DriverLocationMapDrawing from "./DriverLocationMapDrawing";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3001");

const DriverLocationTracker = () => {
    const location = useLocation();
    const [position, setPosition] = useState({ latitude: null, longitude: null });
    const [tracking, setTracking] = useState(false);
    const rideId = location.state?.rideId;

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
                { enableHighAccuracy: true}
            );

            return () => navigator.geolocation.clearWatch(watchId);
            
        }
    }, [tracking])

    const handleStartTracking = () => setTracking(true);
    const handleStopTracking = () => setTracking(false);

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Driver Location Tracker</h2>

            {position.latitude && position.longitude && (
                <p className="text-lg text-gray-700 mb-4">
                    Your current location is:
                    <br />
                    Latitude: {position.latitude}
                    <br />
                    Longitude: {position.longitude}
                </p>
            )}

            <div className="w-full max-w-3xl mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Live Driver Location</h3>
                {position.latitude && position.longitude ? (
                    <DriverLocationMapDrawing coordinates={[position.longitude, position.latitude]} />
                ) : (
                    <p className="text-gray-500">Please enable your location tracking to view your current location.</p>
                )}
            </div>

            <div className="space-x-4 mt-4">
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