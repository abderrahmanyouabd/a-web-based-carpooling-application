import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import {jwtDecode} from 'jwt-decode';

function ChatApp() {
    const { rideId } = useParams();
    const token = localStorage.getItem('jwtToken');
    const [userId, setUserId] = useState(null);
    const [fullName, setFullName] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const messageInputRef = useRef(null);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (rideId && token) {
            fetchUserDetails(rideId);
        }
    }, [rideId, token]);

    useEffect(() => {
        if (connected) {
            fetchChatHistory();
        }
    }, [connected]);

    const fetchUserDetails = async (rideId) => {
        try {
            const res = await fetch(`/api/trips/${rideId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                const trip = await res.json();
                const decodedToken = jwtDecode(token);
                const user = trip.passengers.find((p) => p.email === decodedToken.email);
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

    const normalizeTimestamp = (timestamp) => new Date(timestamp).getTime();

    const connect = () => {
        if (!rideId || !userId) {
            console.error('Ride ID or User ID is missing!');
            return;
        }

        const socket = new SockJS('/ws');
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setConnected(true);

        stompClientRef.current.subscribe(`/topic/ride/${rideId}`, (payload) => {
            const msg = JSON.parse(payload.body);
            setMessages((prev) => {
                const isDuplicate = prev.some(
                    (m) =>
                        m.senderId === msg.senderId &&
                        normalizeTimestamp(m.timestamp) === normalizeTimestamp(msg.timestamp) &&
                        m.content === msg.content
                );
                if (!isDuplicate) {
                    return [...prev, msg];
                }
                return prev;
            });
        });

        stompClientRef.current.subscribe('/topic/public', () => {
            fetchConnectedUsers();
        });

        stompClientRef.current.send(
            '/app/user.addUser',
            {},
            JSON.stringify({
                chatUserId: userId,
                fullName: fullName,
                status: 'ONLINE',
            })
        );

        fetchConnectedUsers();
    };

    const onError = (error) => {
        console.error('Could not connect to WebSocket server:', error);
    };

    const fetchConnectedUsers = async () => {
        try {
            const res = await fetch('/connected-users', {
                headers: {
                    Authorization: `Bearer ${token}`,
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
                    const existingMessages = new Set(
                        prev.map((msg) => `${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
                    );
                    const uniqueHistory = history.filter(
                        (msg) =>
                            !existingMessages.has(`${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
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
        if (!stompClientRef.current) {
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

        setMessages((prev) => {
            const isDuplicate = prev.some(
                (m) =>
                    m.senderId === chatMessage.senderId &&
                    normalizeTimestamp(m.timestamp) === normalizeTimestamp(chatMessage.timestamp) &&
                    m.content === chatMessage.content
            );
            if (!isDuplicate) {
                return [...prev, chatMessage];
            }
            return prev;
        });

        stompClientRef.current.send(`/app/chat/ride/${rideId}`, {}, JSON.stringify(chatMessage));
        messageInputRef.current.value = '';
    };

    const disconnectUser = () => {
        if (stompClientRef.current) {
            stompClientRef.current.send(
                '/app/user.disconnectUser',
                {},
                JSON.stringify({
                    chatUserId: userId,
                    fullName: fullName,
                    status: 'OFFLINE',
                })
            );
            stompClientRef.current.disconnect();
            setConnected(false);
        }
    };

    useEffect(() => {
        return () => {
            disconnectUser();
        };
    }, []);

    return (
        <div style={{ width: '80%', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
            {connected ? (
                <div style={{ display: 'flex', height: '80vh', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
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
                                        src={`https://api.dicebear.com/9.x/pixel-art/svg`}
                                        alt={user.fullName}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
                                    />
                                    <span>{user.fullName}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={disconnectUser}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Disconnect
                        </button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
                        <div id="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#fafafa' }}>
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === userId;
                                const senderName = isMe
                                    ? 'Me'
                                    : connectedUsers.find((user) => user.chatUserId === msg.senderId)?.fullName || `User ${msg.senderId}`;
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
                                        <small style={{fontSize: '10px', color: '#666'}}>
                                            {senderName} | {new Date(msg.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                );
                            })}
                        </div>
                        <form style={{display: 'flex', padding: '16px', borderTop: '1px solid #ccc' }} onSubmit={sendMessage}>
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
                <button
                    onClick={connect}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        color: '#fff',
                        backgroundColor: '#007BFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Connect to Ride Chat
                </button>
            )}
        </div>
    );
}

export default ChatApp;