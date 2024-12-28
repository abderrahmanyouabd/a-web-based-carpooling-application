import React, { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./WebSocketProvider";

const NotificationListener = ({ user }) => {
    const { stompClient, isConnected } = useWebSocket();
    const [alert, setAlert] = useState(null);
    const [rideIds, setRideIds] = useState([]);
    const subscribedRides = useRef(new Set());

    useEffect(() => {
        if (user && localStorage.getItem("jwtToken")) {
            fetchUserRides();
        }
    }, [user]);

    // Once we know which rides the user has joined, subscribe to those notifications
    useEffect(() => {
        if (isConnected && stompClient && rideIds.length > 0) {
            subscribeToRideNotifications();
        }
    }, [isConnected, stompClient, rideIds]);

    const fetchUserRides = async () => {
        try {
            const res = await fetch("/api/trips/joined", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
                },
            });
            if (res.ok) {
                const rides = await res.json();
                const ids = rides.map((ride) => ride.id);
                setRideIds(ids);
            } else {
                console.error("Failed to fetch joined rides");
            }
        } catch (error) {
            console.error("Error fetching joined rides:", error);
        }
    };

    const subscribeToRideNotifications = () => {
        rideIds.forEach((rideId) => {
            if (!subscribedRides.current.has(rideId)) {
                try {
                    stompClient.subscribe(`/topic/notification/${rideId}`, (payload) => {
                        const notification = JSON.parse(payload.body);
                        if (notification.senderId !== user?.id) {
                            showNotification(notification.rideId, notification.message);
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
        setAlert(`Ride ${rideId}: ${message}`);
        setTimeout(() => {
            setAlert(null);
        }, 7000);
    };

    return alert ? (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                backgroundColor: "#f0ad4e",
                color: "#fff",
                padding: "10px 20px",
                borderRadius: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                zIndex: 1000,
            }}
        >
            {alert}
        </div>
    ) : null;
};

export default NotificationListener;
