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
    const [passengers, setPassengers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [connectedUsers, setConnectedUsers] = useState([]);

    const messageInputRef = useRef(null);

    // Keep chat scrolled to bottom on new messages
    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }, [messages]);

    // 1. Fetch user details (from the ride) when rideId or token changes
    useEffect(() => {
        if (rideId && token) fetchUserDetails(rideId);
    }, [rideId, token]);

    // 2. Once connected to WebSocket, subscribe to the ride topic & fetch chat history
    useEffect(() => {
        if (isConnected && stompClient && rideId && userId) {
            const subscription = subscribeToRideChat();
            fetchConnectedUsers();
            fetchChatHistory();

            // Cleanup subscription when unmounting
            return () => subscription.unsubscribe();
            
        }
    }, [isConnected, stompClient, rideId, userId]);

    // 3. Subscribe to /topic/public so we refresh connected users
    //    whenever someone logs in or out globally.
    useEffect(() => {
        if (isConnected && stompClient) {
            const publicSubscription = subscribeToPublicNotifications();
            return () => publicSubscription.unsubscribe();
        }
    }, [isConnected, stompClient]);

    const normalizeTimestamp = (timestamp) => new Date(timestamp).getTime();

    const fetchUserDetails = async (rideId) => {
        const url = `/api/trips/${rideId}`;
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const trip = await fetchApi(url, { headers });
            const decoded = jwtDecode(token);
            const user = trip?.passengers?.find((p) => p.email === decoded.email);
            // console.log("User profile: ", trip.passengers[0].profilePicture)
            setPassengers(trip?.passengers);
        

            if (user) {
                setUserId(user.id);
            } else {
                console.error('Logged-in user is not part of this ride.');
            }
        } catch (err) {
            console.error('Error fetching trip details:', err);
        }
    };

    const fetchConnectedUsers = async () => {
        const url = `/connected-users?rideId=${rideId}`;
        try {
            const users = await fetchApi(url);
            setConnectedUsers(users || []);
        } catch (err) {
            console.error('Error fetching connected users:', err);
        }
    };

    const fetchChatHistory = async () => {
        const url = `/messages/ride/${rideId}`;
        try {
            const history = await fetchApi(url);
            addUniqueMessages(history || []);
        } catch (err) {
            console.error('Error fetching chat history:', err);
        }
    };

    const subscribeToRideChat = () => {
        return stompClient.subscribe(`/topic/ride/${rideId}`, (payload) => {
            const msg = JSON.parse(payload.body);
            addUniqueMessages([msg])
        })
    }

    const subscribeToPublicNotifications = () => {
        return stompClient.subscribe("/topic/public", fetchConnectedUsers);
    };

    const addUniqueMessages = (newMessages) => {
        setMessages((prev) => {
            const existingKeys = new Set(
                prev.map((msg) => `${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
            );
            const uniqueMessages = newMessages.filter(
                (msg) =>!existingKeys.has(`${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
            );
            return [...prev,...uniqueMessages];
        });
    }

    const fetchApi = async (url, options = {}) => {
        const res = await fetch(url, { method: "GET", ...options});
        if (res.ok) return res.json();
        throw new Error(`API request failed for ${url}`);
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

        
        addUniqueMessages([chatMessage]);
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
                                > {/* -1 because Id in connected Users is starting from 1 but array index start from 0 */}
                                    {passengers[user.chatUserId - 1].profilePicture ? ( 
                                        
                                        <img 
                                            src={`data:image/jpeg;base64,${passengers[user.chatUserId - 1].profilePicture}`} 
                                            alt="Profile" 
                                            className="w-10 h-10 object-cover rounded-full mr-3" 
                                        />
                                    ) : (
                                        <img 
                                            src={
                                                passengers[user.chatUserId - 1].gender === "FEMALE"
                                                    ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                                    : passengers[user.chatUserId - 1].gender === "MALE"
                                                        ? "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png"
                                                        : "https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
                                            }
                                            alt="Default Profile"
                                            className="w-10 h-10 object-cover rounded-full"
                                        />
                                    )}
                                    <span>{user.fullName}</span>
                                    {/* Display user profile here getting from fetchUserDetails  */}
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
