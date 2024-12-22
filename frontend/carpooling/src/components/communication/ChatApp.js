// import React, { useState, useRef, useEffect } from 'react';
// import SockJS from 'sockjs-client';
// import { over } from 'stompjs';
//
// function ChatApp() {
//     // -------------- State variables --------------
//     // For the registration form
//     const [nickname, setNickname] = useState('');
//     const [fullName, setFullName] = useState('');
//     const [connected, setConnected] = useState(false);
//
//     // For the chat
//     const [connectedUsers, setConnectedUsers] = useState([]);
//     const [selectedUserId, setSelectedUserId] = useState(null);
//     const [messages, setMessages] = useState([]);
//     const messageInputRef = useRef(null);
//
//     const stompClientRef = useRef(null);
//
//     // -------------- Connect / Registration --------------
//     const connect = (e) => {
//         e.preventDefault();
//         if (!nickname.trim() || !fullName.trim()) return;
//
//         // Initialize SockJS + STOMP
//         const socket = new SockJS('/ws');
//         const stompClient = over(socket);
//         stompClientRef.current = stompClient;
//
//         // Attempt connection
//         stompClient.connect({}, onConnected, onError);
//     };
//
//     const onConnected = () => {
//         setConnected(true);
//
//         // Subscribe to private queue: /user/<nickname>/queue/messages
//         stompClientRef.current.subscribe(
//             `/user/${nickname}/queue/messages`,
//             onMessageReceived
//         );
//
//         // (Optional) Subscribe to a public channel if your backend supports it
//         stompClientRef.current.subscribe('/topic/public', onMessageReceived);
//
//         // Send the "JOIN" message to register user on backend
//         stompClientRef.current.send(
//             '/app/user.addUser',
//             {},
//             JSON.stringify({
//                 chatUserId: nickname,
//                 fullName: fullName,
//                 status: 'ONLINE',
//             })
//         );
//
//         // After connected, fetch the list of currently connected users
//         fetchConnectedUsers();
//     };
//
//     const onError = (error) => {
//         console.error('Could not connect to WebSocket server:', error);
//     };
//
//     // -------------- Fetch Connected Users --------------
//     const fetchConnectedUsers = async () => {
//         try {
//             const res = await fetch('/connected-users');
//             if (!res.ok) {
//                 console.error('Failed to fetch connected users');
//                 return;
//             }
//             let users = await res.json();
//
//             // Filter out the current user from the list
//             users = users.filter((u) => u.chatUserId !== nickname);
//             setConnectedUsers(users);
//         } catch (err) {
//             console.error('Error fetching connected users:', err);
//         }
//     };
//
//     // -------------- Handling Messages --------------
//     // When a new message arrives via STOMP
//     const onMessageReceived = async (payload) => {
//         // Possibly refresh the user list to track who’s online/offline
//         await fetchConnectedUsers();
//
//         const msg = JSON.parse(payload.body);
//
//         // If this message is from the user we are actively chatting with,
//         // add it to our local messages state
//         if (selectedUserId && selectedUserId === msg.senderId) {
//             setMessages((prev) => [...prev, msg]);
//         }
//     };
//
//     // Select a user to chat with
//     const handleUserSelect = async (userId) => {
//         setSelectedUserId(userId);
//         setMessages([]); // clear old messages from state
//
//         try {
//             // Load chat history from your backend
//             // e.g. GET /messages/<senderId>/<recipientId>
//             const res = await fetch(`/messages/${nickname}/${userId}`);
//             if (!res.ok) {
//                 console.error('Failed to fetch user chat');
//                 return;
//             }
//             const history = await res.json();
//             setMessages(history);
//         } catch (err) {
//             console.error('Error fetching chat history:', err);
//         }
//     };
//
//     // -------------- Sending a Message --------------
//     const sendMessage = (e) => {
//         e.preventDefault();
//         if (!selectedUserId || !stompClientRef.current) return;
//
//         const content = messageInputRef.current.value.trim();
//         if (!content) return;
//
//         const chatMessage = {
//             senderId: nickname,
//             recipientId: selectedUserId,
//             content: content,
//             timestamp: new Date(),
//         };
//
//         stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));
//
//         // Optimistically show the message in our local UI
//         setMessages((prev) => [...prev, chatMessage]);
//         messageInputRef.current.value = '';
//     };
//
//     // -------------- Logout --------------
//     const onLogout = () => {
//         if (stompClientRef.current) {
//             stompClientRef.current.send(
//                 '/app/user.disconnectUser',
//                 {},
//                 JSON.stringify({
//                     chatUserId: nickname,
//                     fullName: fullName,
//                     status: 'OFFLINE',
//                 })
//             );
//             stompClientRef.current.disconnect();
//         }
//         window.location.reload();
//     };
//
//     // -------------- Render --------------
//     return (
//         <div style={{ width: '80%', margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
//             {!connected && (
//                 <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 4 }}>
//                     <h2>Enter Chatroom</h2>
//                     <form onSubmit={connect}>
//                         <label>Nickname (User ID):</label>
//                         <input
//                             type="text"
//                             required
//                             value={nickname}
//                             onChange={(e) => setNickname(e.target.value)}
//                             style={{ width: '100%', padding: 8, marginTop: 4 }}
//                         />
//
//                         <label>Real Name:</label>
//                         <input
//                             type="text"
//                             required
//                             value={fullName}
//                             onChange={(e) => setFullName(e.target.value)}
//                             style={{ width: '100%', padding: 8, marginTop: 4 }}
//                         />
//
//                         <button
//                             type="submit"
//                             style={{ marginTop: 16, width: '100%', padding: 10, cursor: 'pointer' }}
//                         >
//                             Enter Chatroom
//                         </button>
//                     </form>
//                 </div>
//             )}
//
//             {connected && (
//                 <div
//                     style={{
//                         display: 'flex',
//                         height: '60vh',
//                         border: '1px solid #ccc',
//                         padding: 16,
//                         borderRadius: 4,
//                         marginTop: 20,
//                     }}
//                 >
//                     {/* Left Sidebar: Connected Users */}
//                     <div style={{ width: '25%', borderRight: '1px solid #ccc', overflowY: 'auto' }}>
//                         <h3>Online Users</h3>
//                         <ul style={{ listStyle: 'none', padding: 0 }}>
//                             {connectedUsers.map((user) => (
//                                 <li
//                                     key={user.chatUserId}
//                                     onClick={() => handleUserSelect(user.chatUserId)}
//                                     style={{
//                                         cursor: 'pointer',
//                                         padding: '8px',
//                                         borderBottom: '1px solid #efefef',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         background:
//                                             selectedUserId === user.chatUserId ? '#f2f2f2' : 'transparent',
//                                     }}
//                                 >
//                                     <img
//                                         src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
//                                         alt={user.fullName}
//                                         style={{ width: 30, height: 30, marginRight: 8 }}
//                                     />
//                                     <span>{user.fullName}</span>
//                                 </li>
//                             ))}
//                         </ul>
//
//                         <p style={{ marginTop: 16 }}>{fullName}</p>
//                         <button
//                             onClick={onLogout}
//                             style={{
//                                 backgroundColor: '#e74c3c',
//                                 color: '#fff',
//                                 padding: '8px 12px',
//                                 border: 'none',
//                                 borderRadius: 4,
//                                 cursor: 'pointer',
//                             }}
//                         >
//                             Logout
//                         </button>
//                     </div>
//
//                     {/* Right Panel: Chat */}
//                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//                         <div
//                             id="chat-messages"
//                             style={{ flex: 1, overflowY: 'auto', background: '#fafafa', padding: 16 }}
//                         >
//                             {messages.map((msg, index) => {
//                                 const isMe = msg.senderId === nickname;
//                                 return (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             margin: 10,
//                                             padding: 10,
//                                             borderRadius: 8,
//                                             maxWidth: '60%',
//                                             wordWrap: 'break-word',
//                                             backgroundColor: isMe ? '#cce5ff' : '#f2f2f2',
//                                             marginLeft: isMe ? 'auto' : '',
//                                             marginRight: !isMe ? 'auto' : '',
//                                         }}
//                                     >
//                                         <p>{msg.content}</p>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//
//                         {selectedUserId && (
//                             <form
//                                 style={{ display: 'flex', borderTop: '1px solid #ccc' }}
//                                 onSubmit={sendMessage}
//                             >
//                                 <input
//                                     type="text"
//                                     ref={messageInputRef}
//                                     placeholder="Type your message..."
//                                     style={{ flex: 1, padding: 8 }}
//                                 />
//                                 <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
//                                     Send
//                                 </button>
//                             </form>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }
//
// export default ChatApp;





import React, { useState, useRef, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

function ChatApp() {
    const [nickname, setNickname] = useState('');
    const [fullName, setFullName] = useState('');
    const [connected, setConnected] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
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

    const connect = (e) => {
        e.preventDefault();
        if (!nickname.trim() || !fullName.trim()) return;

        console.log('Attempting to connect...');
        const socket = new SockJS('/ws');
        const stompClient = over(socket);
        stompClientRef.current = stompClient;

        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        console.log('Connected to WebSocket');
        setConnected(true);

        stompClientRef.current.subscribe(
            `/user/${nickname}/queue/messages`,
            (payload) => {
                console.log('Received message in subscription:', payload.body); // Debug received messages
                onMessageReceived(payload);
            }
        );

        console.log('Subscribed to private queue:', `/user/${nickname}/queue/messages`);

        stompClientRef.current.send(
            '/app/user.addUser',
            {},
            JSON.stringify({
                chatUserId: nickname,
                fullName: fullName,
                status: 'ONLINE',
            })
        );

        console.log('Sent user add request:', { nickname, fullName });
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
            setConnectedUsers(users.filter((u) => u.chatUserId !== nickname));
        } catch (err) {
            console.error('Error fetching connected users:', err);
        }
    };

    const onMessageReceived = (payload) => {
        const msg = JSON.parse(payload.body);
        console.log('Parsed received message:', msg);

        if (selectedUserId && selectedUserId === msg.senderId) {
            console.log('Message is from the currently selected user. Adding to chat.');
            setMessages((prev) => [...prev, msg]);
        } else {
            console.log('Message is from a different user. Marking as new.');
            setConnectedUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.chatUserId === msg.senderId
                        ? { ...user, hasNewMessage: true }
                        : user
                )
            );
        }
    };

    const handleUserSelect = async (userId) => {
        console.log('Selected user for chat:', userId);
        setConnectedUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.chatUserId === userId ? { ...user, hasNewMessage: false } : user
            )
        );

        setSelectedUserId(userId);
        setMessages([]);

        try {
            const res = await fetch(`/messages/${nickname}/${userId}`);
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
        if (!selectedUserId || !stompClientRef.current) {
            console.warn('Cannot send message. No user selected or WebSocket not connected.');
            return;
        }

        const content = messageInputRef.current.value.trim();
        if (!content) {
            console.warn('Cannot send empty message.');
            return;
        }

        const chatMessage = {
            senderId: nickname,
            recipientId: selectedUserId,
            content: content,
            timestamp: new Date(),
        };

        console.log('Sending message:', chatMessage);
        stompClientRef.current.send('/app/chat', {}, JSON.stringify(chatMessage));

        setMessages((prev) => [...prev, chatMessage]);
        messageInputRef.current.value = '';
    };

    const onLogout = () => {
        if (stompClientRef.current) {
            stompClientRef.current.send(
                '/app/user.disconnectUser',
                {},
                JSON.stringify({
                    chatUserId: nickname,
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
                        <label>Nickname (User ID):</label>
                        <input
                            type="text"
                            required
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
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
                                    onClick={() => handleUserSelect(user.chatUserId)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderBottom: '1px solid #efefef',
                                        display: 'flex',
                                        alignItems: 'center',
                                        background:
                                            selectedUserId === user.chatUserId ? '#f2f2f2' : 'transparent',
                                    }}
                                >
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                                        alt={user.fullName}
                                        style={{ width: 30, height: 30, marginRight: 8 }}
                                    />
                                    <span>{user.fullName}</span>
                                    {user.hasNewMessage && (
                                        <span
                                            style={{
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '4px 8px',
                                                marginLeft: '8px',
                                                fontSize: '12px',
                                            }}
                                        >
                                            New
                                        </span>
                                    )}
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
                                const isMe = msg.senderId === nickname;
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
                                    </div>
                                );
                            })}
                        </div>

                        {selectedUserId && (
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
