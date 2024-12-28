import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

// context to share the client and connection state
const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ user, children }) => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    // Connect/disconnect once user logs in or logs out
    useEffect(() => {
        if (user && localStorage.getItem("jwtToken")) {
            connectWebSocket();
            return () => {
                disconnectWebSocket();
            };
        }
        // disc If user is null or no token up there
        disconnectWebSocket();
    }, [user]);

    const connectWebSocket = () => {
        // disconnect existng connection first before creating a new one
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.disconnect(() => {
                console.log("Previous WebSocket disconnected.");
            });
        }

        const socket = new SockJS("/ws");
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect(
            {},
            () => {
                console.log("Global WebSocket connected");
                setIsConnected(true);

                // Mark user "online" globally
                stompClient.send(
                    "/app/user.addUser",
                    {},
                    JSON.stringify({
                        chatUserId: user.id,
                        fullName: user.fullName,
                        status: "ONLINE",
                    })
                );
            },
            (error) => {
                console.error("Error connecting to WebSocket:", error);
                retryConnection();
            }
        );
    };

    const retryConnection = () => {
        setTimeout(() => {
            console.log("Retrying WebSocket connection...");
            connectWebSocket();
        }, 5000);
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            // Mark user "offline" globally
            stompClientRef.current.send(
                "/app/user.disconnectUser",
                {},
                JSON.stringify({
                    chatUserId: user?.id,
                    fullName: user?.fullName,
                    status: "OFFLINE",
                })
            );
            stompClientRef.current.disconnect(() => {
                console.log("Global WebSocket disconnected.");
            });
        }
        setIsConnected(false);
    };

    const value = {
        stompClient: stompClientRef.current,
        isConnected,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

