import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

const NotificationListener = ({ user }) => {
    const { stompClient, isConnected } = useWebSocket();
    const [alert, setAlert] = useState(null);
    const [rideIds, setRideIds] = useState([]);
    const subscribedRides = useRef(new Set());

    useEffect(() => {
        console.log("NotificationListener: user changed to", user);

        // Clear out old subscriptions
        subscribedRides.current = new Set();
        setRideIds([]);

        const token = localStorage.getItem("jwtToken");
        if (user && token) {
            console.log("NotificationListener: calling fetchUserRides()");
            fetchUserRides();
        } else {
            console.log("NotificationListener: skipping fetchUserRides (no user or no token)");
        }
    }, [user]);


    useEffect(() => {
        console.log(
            "NotificationListener: rideIds changed:",
            rideIds,
            "| isConnected=",
            isConnected
        );

        if (isConnected && stompClient && rideIds.length > 0) {
            console.log("NotificationListener: subscribing to rides now...", rideIds);
            subscribeToRideNotifications();
        } else {
            console.log("NotificationListener: conditions not met for subscribe (or rideIds empty)");
        }
    }, [isConnected, stompClient, rideIds]);

    const fetchUserRides = async () => {
        console.log("NotificationListener: fetchUserRides() called");
        try {
            const res = await fetch("/api/trips/joined", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            if (res.ok) {
                const rides = await res.json();
                console.log("NotificationListener: fetched rides:", rides);
                const ids = rides.map((ride) => ride.id);
                setRideIds(ids);
            } else {
                console.error("NotificationListener: Failed to fetch joined rides, status:", res.status);
            }
        } catch (error) {
            console.error("NotificationListener: Error fetching joined rides:", error);
        }
    };

    const subscribeToRideNotifications = () => {
        console.log("NotificationListener: subscribeToRideNotifications() called with rideIds:", rideIds);

        rideIds.forEach((rideId) => {
            if (!subscribedRides.current.has(rideId)) {
                console.log(`NotificationListener: Subscribing to /topic/notification/${rideId}`);
                try {
                    stompClient.subscribe(`/topic/notification/${rideId}`, (payload) => {
                        const notification = JSON.parse(payload.body);
                        if (notification.senderId !== user?.id) {
                            showNotification(notification.rideId, notification.message);
                        } else {
                            console.log("NotificationListener: ignoring own notification", notification);
                        }
                    });
                    subscribedRides.current.add(rideId);
                } catch (error) {
                    console.error(`Error subscribing to ride ${rideId}:`, error);
                }
            }
        });
    };

    const showNotification = (rideId, message) => {
        console.log("NotificationListener: showNotification ->", { rideId, message });
        setAlert(`Ride ${rideId}: ${message}`);
        setTimeout(() => {
            setAlert(null);
        }, 7000);
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
