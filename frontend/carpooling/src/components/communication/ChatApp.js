import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from './WebSocketProvider';
import {jwtDecode} from 'jwt-decode';
import Message from './Message';

const ChatApp = () => {
    const { rideId } = useParams();
    const token = localStorage.getItem('jwtToken');
    const { stompClient, isConnected } = useWebSocket();

    const [userId, setUserId] = useState(null);
    const [fullName, setFullName] = useState('');
    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);

    const messageInputRef = useRef(null);

    // Keep chat scrolled to bottom on new messages
    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, [messages]);

    // 1. Fetch user details (from the ride) when rideId or token changes
    useEffect(() => {
        if (rideId && token) {
            fetchUserDetails(rideId);
        }
    }, [rideId, token]);

    // 2. Once connected to WebSocket, subscribe to the ride topic & fetch chat history
    useEffect(() => {
        if (isConnected && stompClient && rideId && userId) {
            // Subscribe to ride specific chat topic
            const subscription = stompClient.subscribe(`/topic/ride/${rideId}`, (payload) => {
                const msg = JSON.parse(payload.body);
                setMessages((prev) => {
                    const isDuplicate = prev.some(
                        (m) =>
                            m.senderId === msg.senderId &&
                            normalizeTimestamp(m.timestamp) === normalizeTimestamp(msg.timestamp) &&
                            m.content === msg.content
                    );
                    return isDuplicate ? prev : [...prev, msg];
                });
            });
            fetchConnectedUsers();

            // Fetch chat history
            fetchChatHistory();

            // Cleanup subscription when unmounting
            return () => {
                subscription.unsubscribe();
            };
        }
    }, [isConnected, stompClient, rideId, userId]);

    // 3. Subscribe to /topic/public so we refresh connected users
    //    whenever someone logs in or out globally.
    useEffect(() => {
        if (isConnected && stompClient) {
            const publicSub = stompClient.subscribe('/topic/public', () => {
                // Whenever the server announces a user add/remove, re-fetch
                fetchConnectedUsers();
            });
            return () => publicSub.unsubscribe();
        }
    }, [isConnected, stompClient]);

    const normalizeTimestamp = (timestamp) => new Date(timestamp).getTime();

    const fetchUserDetails = async (rideId) => {
        try {
            const res = await fetch(`/api/trips/${rideId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const trip = await res.json();
                const decoded = jwtDecode(token);
                const user = trip.passengers.find((p) => p.email === decoded.email);
                if (user) {
                    setUserId(user.id);
                    setFullName(user.fullName);
                } else {
                    console.error('Logged-in user is not part of this ride.');
                }
            } else {
                console.error('Failed to fetch trip details for ride');
            }
        } catch (err) {
            console.error('Error fetching trip details:', err);
        }
    };

    const fetchConnectedUsers = async () => {
        try {
            const res = await fetch(`/connected-users?rideId=${rideId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                const users = await res.json();
                setConnectedUsers(users);
            } else {
                console.error('Failed to fetch connected users');
            }
        } catch (err) {
            console.error('Error fetching connected users:', err);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const res = await fetch(`/messages/ride/${rideId}`);
            if (res.ok) {
                const history = await res.json();
                setMessages((prev) => {
                    const existingKeys = new Set(
                        prev.map((msg) => `${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
                    );
                    const uniqueHistory = history.filter(
                        (msg) => !existingKeys.has(`${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
                    );
                    return [...prev, ...uniqueHistory];
                });
            }
        } catch (err) {
            console.error('Error fetching chat history:', err);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!stompClient) {
            console.warn('WebSocket client not connected.');
            return;
        }
        const content = messageInputRef.current.value.trim();
        if (!content) {
            console.warn('Cannot send empty message.');
            return;
        }
        const chatMessage = {
            senderId: userId,
            rideId,
            content,
            timestamp: new Date().toISOString(),
        };

        // Optimistically add the message
        setMessages((prev) => {
            const isDuplicate = prev.some(
                (m) =>
                    m.senderId === chatMessage.senderId &&
                    normalizeTimestamp(m.timestamp) === normalizeTimestamp(chatMessage.timestamp) &&
                    m.content === chatMessage.content
            );
            return isDuplicate ? prev : [...prev, chatMessage];
        });

        // Send to server for DB storage
        stompClient.send(`/app/chat/ride/${rideId}`, {}, JSON.stringify(chatMessage));
        messageInputRef.current.value = '';
    };

    return (
        <div className="w-4/5 mx-auto mt-5 font-sans">
            {isConnected ? (
                <div className="flex h-[80vh] border border-gray-300 rounded-lg overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Online Users</h3>
                        <ul className="space-y-3">
                            {connectedUsers.map((user) => (
                                <li
                                    key={user.chatUserId}
                                    className="flex items-center p-2 border-b border-gray-200"
                                >
                                    <img
                                        src="https://api.dicebear.com/9.x/pixel-art/svg"
                                        alt={user.fullName}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <span>{user.fullName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Chat */}
                    <div className="flex flex-col flex-1 bg-white">
                        <div
                            id="chat-messages"
                            className="flex-1 overflow-y-auto p-4 bg-gray-50"
                        >
                            {messages.map((msg, index) => (
                                <Message 
                                    key={index}
                                    message={msg.content}
                                    senderId={msg.senderId}
                                    userId={userId}
                                    connectedUsers={connectedUsers}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                        </div>
                        <form 
                            className="flex p-4 border-t border-gray-300" 
                            onSubmit={sendMessage}
                        >
                            <input
                                type="text"
                                ref={messageInputRef}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div>Loading chat...</div>
            )}
        </div>
    );
}

export default ChatApp;
