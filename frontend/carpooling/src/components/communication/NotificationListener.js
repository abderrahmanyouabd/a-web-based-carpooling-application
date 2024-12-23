import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

const NotificationListener = ({ user }) => {
    const stompClientRef = useRef(null);
    const [alert, setAlert] = useState(null);
    const [rideIds, setRideIds] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const subscribedRides = useRef(new Set());

    useEffect(() => {
        if (user && localStorage.getItem('jwtToken')) {
            fetchUserRides();
            connectWebSocket();
        }


        return () => {
            if (!localStorage.getItem('jwtToken')) {
                disconnectWebSocket();
            }
        };
    }, [user]);

    useEffect(() => {
        if (isConnected && rideIds.length > 0) {
            subscribeToRideNotifications();
            subscribeToOnlineUsers();
        }
    }, [isConnected, rideIds]);

    const fetchUserRides = async () => {
        try {
            const res = await fetch('/api/trips/joined', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
            });
            if (res.ok) {
                const rides = await res.json();
                const ids = rides.map((ride) => ride.id);
                setRideIds(ids);
            } else {
                console.error('Failed to fetch joined rides');
            }
        } catch (error) {
            console.error('Error fetching joined rides:', error);
        }
    };

    const connectWebSocket = () => {
        if (stompClientRef.current) {
            if (stompClientRef.current.connected) {
                stompClientRef.current.disconnect(() => {
                    console.log('Previous WebSocket disconnected.');
                });
            }
        }

        const socket = new SockJS('/ws');
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect(
            {},
            () => {
                console.log('WebSocket connected');
                setIsConnected(true);
            },
            (error) => {
                console.error('Error connecting to WebSocket:', error);
                retryConnection();
            }
        );
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(
                '/app/user.disconnectUser',
                {},
                JSON.stringify({
                    chatUserId: user.id,
                    fullName: user.fullName,
                    status: 'OFFLINE',
                })
            );

            stompClientRef.current.disconnect(() => {
                console.log('WebSocket disconnected due to logout or token removal.');
            });

            setIsConnected(false);
            setRideIds([]);
            subscribedRides.current.clear();
        } else {
            console.warn('No active WebSocket connection to disconnect.');
        }
    };


    const subscribeToRideNotifications = () => {
        if (!stompClientRef.current || !isConnected) {
            console.warn('WebSocket not connected. Skipping subscription.');
            return;
        }

        rideIds.forEach((rideId) => {
            if (!subscribedRides.current.has(rideId)) {
                try {
                    stompClientRef.current.subscribe(`/topic/notification/${rideId}`, (payload) => {
                        const notification = JSON.parse(payload.body);

                        // Ignore notifications from the current user
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

    const subscribeToOnlineUsers = () => {
        if (!stompClientRef.current || !isConnected) {
            console.warn('WebSocket not connected. Skipping subscription.');
            return;
        }

        try {
            stompClientRef.current.subscribe('/topic/public', (payload) => {
                const onlineUsersList = JSON.parse(payload.body);
                setOnlineUsers(onlineUsersList);
            });

            stompClientRef.current.send(
                '/app/user.addUser',
                {},
                JSON.stringify({
                    chatUserId: user?.id,
                    fullName: user?.fullName,
                    status: 'ONLINE',
                })
            );
        } catch (error) {
            console.error('Error subscribing to online users:', error);
        }
    };

    const retryConnection = () => {
        setTimeout(() => {
            console.log('Retrying WebSocket connection...');
            connectWebSocket();
        }, 5000);
    };

    const showNotification = (rideId, message) => {
        setAlert(`Ride ${rideId}: ${message}`);
        setTimeout(() => {
            setAlert(null);
        }, 7000);
    };

    return (
        <>
            {alert && (
                <div
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        backgroundColor: '#f0ad4e',
                        color: '#fff',
                        padding: '10px 20px',
                        borderRadius: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                    }}
                >
                    {alert}
                </div>
            )}
        </>
    );
};

export default NotificationListener;


