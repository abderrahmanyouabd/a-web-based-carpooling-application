import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

const NotificationListener = ({ user }) => {
    const { stompClient, isConnected } = useWebSocket();
    const [alert, setAlert] = useState(null);
    const [rideIds, setRideIds] = useState([]);
    const [userJoinedTrips, setUserJoinedTrips] = useState(null);
    const subscribedRides = useRef(new Set());

    useEffect(() => {
        if (!user) {
            clearSubscription();
            return;
        }

        const token = localStorage.getItem("jwtToken");
        if (token) {
            fetchUserRides(token);
        } else {
            console.log("NotificationListener: skipping fetchUserRides (no token)");
        }
    }, [user]);


    useEffect(() => {
        if (isConnected && stompClient && rideIds.length > 0) {
            subscribeToRideNotifications();
        } else {
            console.log("NotificationListener: conditions not met for subscribe (or rideIds empty)");
        }

    }, [isConnected, stompClient, rideIds]);

    const fetchUserRides = async (token) => {
        try {
            const response = await fetch("/api/trips/joined", {
                headers: { Authorization: `Bearer ${token}`},
            });

            if(!response.ok){
                console.error("NotificationListener: Failed to fetch joined rides, status:", response.status);
                return;
            }

            const rides = await response.json();
            setRideIds(rides.map((ride) =>ride.id));
            setUserJoinedTrips(rides);
        } catch (error) {
            console.error("NotificationListener: Error fetching joined rides:", error);
        }
    };

    const subscribeToRideNotifications = () => {
        rideIds.forEach((rideId) => {
            if (!subscribedRides.current.has(rideId)) {
                try {
                    stompClient.subscribe(`/topic/notification/${rideId}`, (payload) => {
                        handleNotification(payload);
                    });
                    subscribedRides.current.add(rideId);
                } catch (error) {
                    console.error(`Error subscribing to ride ${rideId}:`, error);
                }
            }
        });
    };

    const handleNotification = (payload) => {
        try {
            const notification = JSON.parse(payload.body);
            if (notification.senderId !== user?.id) {
                showNotification(notification.rideId, notification.message);
            } else {
                console.log("NotificationListener: ignoring own notification", notification);
            }
        } catch (error) {
            console.error("Error processing notification payload:", error);
        }
    };

    const showNotification = (rideId, message) => {
        const tripLocations = getTripLocationsById(rideId);
        const lastPartOfMessage = message.split(':').pop().trim(); // Extract last part after colon and trim whitespace
        
        if (tripLocations) {
            const { leavingFrom, goingTo } = tripLocations;
            setAlert(`Your rip from ${leavingFrom} to ${goingTo} has got a new message: ${lastPartOfMessage}`);
        } else {
            setAlert(`Ride ${rideId}: ${lastPartOfMessage}`);
        }

        setTimeout(() => setAlert(null), 7000);
    };

    const getTripLocationsById = (rideId) => {
        const trip = userJoinedTrips.find(t => t.id ===rideId);
        if (trip) {
            return {
                leavingFrom: trip.leavingFrom.name,
                goingTo: trip.goingTo.name,
            };
        } else {
            return null;
        }
    }

    const clearSubscription = () => {
        subscribedRides.current.clear();
        setRideIds([]);
    };

    return alert ? (
        <div
            className="fixed top-5 right-5 bg-yellow-500 text-white py-2 px-4 
                rounded shadow-md z-50"
        >
            {alert}
        </div>
    ) : null;
};

export default NotificationListener;