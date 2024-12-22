import React, { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

function ChatApp() {
    const [userId, setUserId] = useState('');
    const [fullName, setFullName] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const messageInputRef = useRef(null);
    const stompClientRef = useRef(null);

    // Auto-scroll chat to the latest message
    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, [messages]);

    const normalizeTimestamp = (timestamp) => new Date(timestamp).getTime();

    useEffect(() => {
        if (connected) {
            fetchChatHistory();
        }
    }, [connected]);

    const connect = (e) => {
        e.preventDefault();
        if (!userId.trim() || !fullName.trim()) return;

        console.log('Attempting to connect...');
        const socket = new SockJS('/ws');
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        // Subscribe to public broadcast topic for messages and user updates
        if (!stompClientRef.current.subscribedToPublic) {
            stompClientRef.current.subscribe('/topic/public', (payload) => {
                const msg = JSON.parse(payload.body);

                if (msg.status) {
                    // Handle user connection/disconnection updates
                    fetchConnectedUsers();
                } else {
                    // Handle chat messages
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
                }
            });

            stompClientRef.current.subscribedToPublic = true;
            console.log('Subscribed to /topic/public');
        }

        stompClientRef.current.send(
            '/app/user.addUser',
            {},
            JSON.stringify({
                chatUserId: parseInt(userId),
                fullName: fullName,
                status: 'ONLINE',
            })
        );

        console.log('Sent user add request:', { userId, fullName });
        fetchConnectedUsers();
    };

    const onError = (error) => {
        console.error('Could not connect to WebSocket server:', error);
    };

    const fetchConnectedUsers = async () => {
        try {
            const res = await fetch('/connected-users');
            if (!res.ok) {
                console.error('Failed to fetch connected users');
                return;
            }
            const users = await res.json();
            console.log('Fetched connected users:', users);
            setConnectedUsers(users);
        } catch (err) {
            console.error('Error fetching connected users:', err);
        }
    };

    const fetchChatHistory = async () => {
        try {
            const res = await fetch(`/messages/group`); // Assuming group chat endpoint
            if (res.ok) {
                const history = await res.json();
                console.log('Fetched chat history:', history);
                setMessages(history);
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
            senderId: parseInt(userId),
            content,
            timestamp: new Date().toISOString(),
        };

        console.log('Sending message:', chatMessage);

        // Optimistically add the message to the chat UI without duplication
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

        stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
        messageInputRef.current.value = '';
    };

    const onLogout = () => {
        if (stompClientRef.current) {
            stompClientRef.current.send(
                '/app/user.disconnectUser',
                {},
                JSON.stringify({
                    chatUserId: parseInt(userId),
                    fullName: fullName,
                    status: 'OFFLINE',
                })
            );
            stompClientRef.current.disconnect();
        }
        console.log('User logged out.');
        window.location.reload();
    };

    return (
        <div style={{ width: '80%', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
            {!connected && (
                <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 4 }}>
                    <h2>Enter Chatroom</h2>
                    <form onSubmit={connect}>
                        <label>User ID:</label>
                        <input
                            type="number"
                            required
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            style={{ width: '100%', padding: 8, marginTop: 4 }}
                        />
                        <label>Real Name:</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            style={{ width: '100%', padding: 8, marginTop: 4 }}
                        />
                        <button
                            type="submit"
                            style={{ marginTop: 16, width: '100%', padding: 10, cursor: 'pointer' }}
                        >
                            Enter Chatroom
                        </button>
                    </form>
                </div>
            )}

            {connected && (
                <div
                    style={{
                        display: 'flex',
                        height: '60vh',
                        border: '1px solid #ccc',
                        padding: 16,
                        borderRadius: 4,
                        marginTop: 20,
                    }}
                >
                    <div style={{ width: '25%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
                        <h3>Online Users</h3>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {connectedUsers.map((user) => (
                                <li
                                    key={user.chatUserId}
                                    style={{
                                        padding: '8px',
                                        borderBottom: '1px solid #efefef',
                                        display: 'flex',
                                        alignItems: 'center',
                                        background: 'transparent',
                                    }}
                                >
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                                        alt={user.fullName}
                                        style={{ width: 30, height: 30, marginRight: 8 }}
                                    />
                                    <span>{user.fullName}</span>
                                </li>
                            ))}
                        </ul>

                        <p style={{ marginTop: 16 }}>{fullName}</p>
                        <button
                            onClick={onLogout}
                            style={{
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                padding: '8px 12px',
                                border: 'none',
                                borderRadius: 4,
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div
                            id="chat-messages"
                            style={{ flex: 1, overflowY: 'auto', background: '#fafafa', padding: 16 }}
                        >
                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === parseInt(userId);
                                return (
                                    <div
                                        key={index}
                                        style={{
                                            margin: 10,
                                            padding: 10,
                                            borderRadius: 8,
                                            maxWidth: '60%',
                                            wordWrap: 'break-word',
                                            backgroundColor: isMe ? '#cce5ff' : '#f2f2f2',
                                            marginLeft: isMe ? 'auto' : '',
                                            marginRight: !isMe ? 'auto' : '',
                                        }}
                                    >
                                        <p>{msg.content}</p>
                                        <small style={{ fontSize: '10px', color: '#666' }}>
                                            {isMe ? 'Me' : `User ${msg.senderId}`} | {new Date(msg.timestamp).toLocaleString()}
                                        </small>
                                    </div>
                                );
                            })}
                        </div>

                        <form
                            style={{ display: 'flex', borderTop: '1px solid #ccc' }}
                            onSubmit={sendMessage}
                        >
                            <input
                                type="text"
                                ref={messageInputRef}
                                placeholder="Type your message..."
                                style={{ flex: 1, padding: 8 }}
                            />
                            <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
