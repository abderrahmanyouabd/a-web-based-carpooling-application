import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle for mobile user
    const messageInputRef = useRef(null);

    const normalizeTimestamp = useCallback((timestamp) => new Date(timestamp).getTime(), []);

    const fetchApi = useCallback(async (url, options = {}) => {
        const res = await fetch(url, { method: "GET", ...options});
        if (res.ok) return res.json();
        throw new Error(`API request failed for ${url}`);
    }, []);

    const addUniqueMessages = useCallback((newMessages) => {
        setMessages((prev) => {
            const existingKeys = new Set(
                prev.map((msg) => `${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
            );
            const uniqueMessages = newMessages.filter(
                (msg) =>!existingKeys.has(`${msg.senderId}-${normalizeTimestamp(msg.timestamp)}-${msg.content}`)
            );
            return [...prev,...uniqueMessages];
        });
    }, [normalizeTimestamp]);

    const fetchUserDetails = useCallback(async (rideId) => {
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
    }, [token, fetchApi]);

    const fetchConnectedUsers = useCallback(async () => {
        const url = `/connected-users?rideId=${rideId}`;
        try {
            const users = await fetchApi(url);
            setConnectedUsers(users || []);
        } catch (err) {
            console.error('Error fetching connected users:', err);
        }
    }, [rideId, fetchApi]);

    const fetchChatHistory = useCallback(async () => {
        const url = `/messages/ride/${rideId}`;
        try {
            const history = await fetchApi(url);
            addUniqueMessages(history || []);
        } catch (err) {
            console.error('Error fetching chat history:', err);
        }
    }, [rideId, fetchApi, addUniqueMessages]);


    const subscribeToRideChat = useCallback(() => {
        console.log(`Subscribing to /topic/ride/${rideId}`);
        return stompClient.subscribe(`/topic/ride/${rideId}`, (payload) => {
            const msg = JSON.parse(payload.body);

            addUniqueMessages([msg]);
        })
    }, [rideId, stompClient, addUniqueMessages]);


    const subscribeToPublicNotifications = useCallback(() => {
        return stompClient.subscribe("/topic/public", async (payload) => {
            const msg = JSON.parse(payload.body);
            console.log("Public notification received:", msg);

            if (msg.status === "OFFLINE") {
                setConnectedUsers((prev) =>
                    prev.filter((user) => user.chatUserId !== msg.chatUserId)
                );
            }
        });
    }, [stompClient]);

    const subscribeToNewPassengerNotifications = useCallback(() => {
        return stompClient.subscribe(`/topic/trip/${rideId}`, async (payload) => {
            const msg = JSON.parse(payload.body);
            console.log("Ride notification received:", msg); // Check if the message is received here
    
            if (msg.type === "NEW_PARTICIPANT") {
                setConnectedUsers((prev) => {
                    const exists = prev.some((user) => user.chatUserId === msg.userId);
                    if (!exists) {
                        return [
                            ...prev,
                            {
                                chatUserId: msg.userId,
                                fullName: msg.userName,
                                gender: msg.gender,
                                profilePicture: msg.profilePicture,
                            },
                        ];
                    }
                    return prev;
                });
            }
        });
    }, [stompClient, rideId])

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

    const getProfilePictureByUserId = (id) => {
        const passenger = passengers.find(p => p.id === id);
        return passenger ? passenger.profilePicture : null;
    }

    const getGenderByUserId = (id) => {
        const gender = passengers.find(p => p.id === id);
        return gender? gender.gender : null;
    }

    // Keep chat scrolled to bottom on new messages
    useEffect(() => {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }, [messages]);

    // 1. Fetch user details (from the ride) when rideId or token changes
    useEffect(() => {
        if (rideId && token) fetchUserDetails(rideId);
    }, [rideId, token, fetchUserDetails]);

    // 2. Once connected to WebSocket, subscribe to the ride topic & fetch chat history
    useEffect(() => {
        if (isConnected && stompClient && rideId && userId) {
            const subscription = subscribeToRideChat();
            fetchConnectedUsers();
            fetchChatHistory();

            // Cleanup subscription when unmounting
            return () => subscription.unsubscribe();
            
        }
    }, [
        isConnected,
        stompClient,
        rideId, 
        userId,
        subscribeToRideChat,
        fetchConnectedUsers,
        fetchChatHistory
    ]);

    // 3. Subscribe to /topic/public so we refresh newly connected passengers
    //    whenever someone logs in or out globally.
    useEffect(() => {
        if (isConnected && stompClient) {
            const publicSubscription = subscribeToPublicNotifications();
            const newPassengerSubscription = subscribeToNewPassengerNotifications();

            return () => {
                publicSubscription.unsubscribe();
                newPassengerSubscription.unsubscribe();
            };
        }
    }, [isConnected, stompClient, subscribeToPublicNotifications, subscribeToNewPassengerNotifications]);

    return (
        <div className="w-4/5 mx-auto mt-5 font-sans">
            {isConnected ? (
                <div className="flex flex-col md:flex-row h-[80vh] border border-gray-300 rounded-lg overflow-hidden">
                    <div className="md:hidden">
                        <button
                            className="w-full text-blue-500 underline py-2 bg-gray-200 border-b border-gray-300"
                            onClick={() => setIsSidebarOpen((prev) => !prev)}
                        >
                            See online users
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div
                        className={`fixed inset-0 bg-gray-100 z-50 p-4 border-r border-gray-300 ${
                            isSidebarOpen ? "block" : "hidden"
                        } md:static md:z-auto md:block md:w-1/4`}
                    >   
                        <div className="md:hidden flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Online Users</h3>
                            <button
                                className="bg-red-500 pr-2 pl-2 text-white rounded-md block md:hidden"
                                onClick={() => setIsSidebarOpen((prev) =>!prev)}
                            >
                                X
                            </button>
                        </div>

                        <ul className="space-y-3 overflow-y-auto h-full">
                            {connectedUsers.map((user) => (
                                <li
                                    key={user.chatUserId}
                                    className="flex items-center p-2 border-b border-gray-200"
                                > {/* -1 because Id in connected Users is starting from 1 but array index start from 0 */}
                                    {getProfilePictureByUserId(user.chatUserId) ? ( 
                                        
                                        <img 
                                            src={`data:image/jpeg;base64,${getProfilePictureByUserId(user.chatUserId)}`}
                                            alt="Profile" 
                                            className="w-10 h-10 object-cover rounded-full mr-3" 
                                        />
                                    ) : (
                                        <img 
                                            src={
                                                getGenderByUserId(user.chatUserId) === "FEMALE"
                                                    ? "https://www.pngkey.com/png/detail/297-2978655_profile-picture-default-female.png"
                                                    : getGenderByUserId(user.chatUserId) === "MALE"
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
                    <div className="flex flex-col flex-1 bg-white h-full">
                        <div
                            id="chat-messages"
                            className="flex-1 overflow-y-auto p-2 bg-gray-50 min-h-0 mb-10"
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

                        <div 
                            className="flex-shrink-0 sticky bg-white bottom-0 border-t border-gray-300"
                        >
                            <form 
                                className="flex p-4 " 
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
                </div>
            ) : (
                <div className="flex justify-center items-center h-[80vh]">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-blue-500 h-12 w-12"></div>
                        <span className="mt-2 text-gray-500 text-lg animate-pulse">Connecting to chat...</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatApp;
