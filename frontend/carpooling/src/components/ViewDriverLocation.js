import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import DriverLocationMapDrawing from "./DriverLocationMapDrawing";
import { useLocation } from "react-router-dom";

const socket = io("http://localhost:3001");

const ViewDriverLocation = ( ) => {
    const location = useLocation();
    const [position, setPosition] = useState({ latitude: null, longitude: null});
    const rideId = location.state?.rideId;

    console.log("Ride Id: " + rideId);

    useEffect(() => {
        socket.emit("joinDriverRoom", rideId)

        socket.on("locationUpdate", (location) => {
            setPosition(location);
        });

        return () => {
            socket.off("locationUpdate");
        };
    }, [rideId]);

    return (
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Live Driver Location</h2>

            {position.latitude && position.longitude && (
                <p className="text-lg text-gray-700 mb-4">
                    Latitude: {position.latitude}
                    <br />
                    Longitude: {position.longitude}
                </p>
            )}

            <div className="w-full max-w-3xl mt-8">
                {position.latitude && position.longitude ? (
                    <DriverLocationMapDrawing coordinates={[position.longitude, position.latitude]} />
                ) : (
                    <p className="text-gray-500">Waiting for location updates...</p>
                )}
            </div>
        
        </div>
    )
}

export default ViewDriverLocation;