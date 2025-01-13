import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ user, children }) => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const oldUserRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");

        if (user) {
            oldUserRef.current = user;
        }

        if (!user || !token) {
            console.log("WebSocketProvider: No user or token => disconnect if needed.");
            disconnectWebSocket();
            return;
        }

        if (!isConnected) {
            console.log("WebSocketProvider: We have user + token => connect if not connected.");
            connectWebSocket();
        }

    }, [user, isConnected]);

    const connectWebSocket = () => {
        const token = localStorage.getItem("jwtToken");
        if (!user || !token) {
            console.log("WebSocketProvider: connectWebSocket called but no user/token - skipping.");
            return;
        }

        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log("WebSocketProvider: Already connected, disconnecting old client...");
            stompClientRef.current.disconnect(() => {
                console.log("Previous WebSocket disconnected.");
            });
        }

        console.log("WebSocketProvider: Attempting to open SockJS('/ws')...");
        const socket = new SockJS("/ws");
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        console.log("WebSocketProvider: Calling stompClient.connect()...");
        stompClient.connect(
            {},
            () => {
                console.log("WebSocketProvider: Global WebSocket connected!");
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
                console.error("WebSocketProvider: Error connecting to WebSocket:", error);
                setIsConnected(false);
                retryConnection();
            }
        );
    };

    const retryConnection = () => {
        const token = localStorage.getItem("jwtToken");
        if (!user || !token) {
            console.log("WebSocketProvider: Skipping WebSocket retry; user/token missing.");
            return;
        }
        setTimeout(() => {
            console.log("WebSocketProvider: Retrying WebSocket connection...");
            connectWebSocket();
        }, 5000);
    };

    const disconnectWebSocket = () => {
        const offlineUser = user || oldUserRef.current;
        if (stompClientRef.current && stompClientRef.current.connected) {
            if (offlineUser) {
                console.log("WebSocketProvider: Disconnecting, marking user offline =>", offlineUser);
                stompClientRef.current.send(
                    "/app/user.disconnectUser",
                    {},
                    JSON.stringify({
                        chatUserId: offlineUser.id,
                        fullName: offlineUser.fullName,
                        status: "OFFLINE",
                    })
                );
            } else {
                console.log("WebSocketProvider: No known user to mark offline.");
            }

            stompClientRef.current.disconnect(() => {
                console.log("WebSocketProvider: Global WebSocket disconnected.");
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
