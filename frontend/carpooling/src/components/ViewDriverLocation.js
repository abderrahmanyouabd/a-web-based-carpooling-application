import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import MapRouteDrawing from "./MapRouteDrawing";

const socket = io("http://localhost:3001");

const ViewDriverLocation = ( ) => {
    const [position, setPosition] = useState({ latitude: null, longitude: null});
    const token = localStorage.getItem('jwtToken');
    const [tripDetails, setTripDetails] = useState(null);
    const { rideId } = useParams();
    const navigate = useNavigate();

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
        socket.emit("joinDriverRoom", rideId)

        socket.on("locationUpdate", (location) => {
            setPosition(location);
        });

        return () => {
            socket.off("locationUpdate");
        };
    }, [rideId]);

    const startCoordinates = tripDetails && [parseFloat(tripDetails.leavingFrom.longitude), parseFloat(tripDetails.leavingFrom.latitude)];
    const endCoordinates = tripDetails && [parseFloat(tripDetails.goingTo.longitude), parseFloat(tripDetails.goingTo.latitude)];
    const driverPosition = position.latitude && position.longitude ? [position.longitude, position.latitude] : null;

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
                    <MapRouteDrawing startCoordinates={startCoordinates} endCoordinates={endCoordinates} driverPosition={driverPosition}/>
                ) : (
                    <p className="text-gray-500">Waiting for location updates...</p>
                )}
            </div>
        
        </div>
    )
}

export default ViewDriverLocation;