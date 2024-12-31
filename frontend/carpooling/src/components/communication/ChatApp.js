import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebSocket } from './WebSocketProvider';
import {jwtDecode} from 'jwt-decode';

function ChatApp() {
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

    // TODO: This is not Responsive enough, I need to fix it.
    return (
        <div style={{ width: '80%', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
            {isConnected ? (
                <div style={{ display: 'flex', height: '80vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    {/* Sidebar */}
                    <div style={{ width: '25%', background: '#f7f7f7', padding: '16px', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                        <h3>Online Users</h3>
                        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                            {connectedUsers.map((user) => (
                                <li
                                    key={user.chatUserId}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '10px',
                                        borderBottom: '1px solid #ddd',
                                    }}
                                >
                                    <img
                                        src="https://api.dicebear.com/9.x/pixel-art/svg"
                                        alt={user.fullName}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                    <span>{user.fullName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Main Chat */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                        <div
                            id="chat-messages"
                            style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#fafafa' }}
                        >
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === userId;
                                const senderName = isMe
                                    ? 'Me'
                                    : connectedUsers.find((u) => u.chatUserId === msg.senderId)?.fullName ||
                                    `User ${msg.senderId}`;
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            margin: '10px',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            maxWidth: '60%',
                                            wordWrap: 'break-word',
                                            backgroundColor: isMe ? '#cce5ff' : '#f2f2f2',
                                            marginLeft: isMe ? 'auto' : '',
                                            marginRight: !isMe ? 'auto' : '',
                                        }}
                                    >
                                        <p>{msg.content}</p>
                                        <small style={{ fontSize: '10px', color: '#666' }}>
                                            {senderName} | {new Date(msg.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                );
                            })}
                        </div>
                        <form style={{ display: 'flex', padding: '16px', borderTop: '1px solid #ccc' }} onSubmit={sendMessage}>
                            <input
                                type="text"
                                ref={messageInputRef}
                                placeholder="Type your message..."
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    marginRight: '10px',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 16px',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
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
