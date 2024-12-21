import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Message from "./Message";

const ChatPage = () => {
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const { driverName } = location.state || {};

    const handleSend = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, { text: newMessage, isUser: true}]);
            setNewMessage("");

            // Simulate driver's response for demo purposes
            setTimeout(() => {
                setMessages((prevMessages) => [
                    ...prevMessages, 
                    { text: `Hello, ${driverName}! How can I help you today?`, isUser: false }]);
            }, 1000);
        }
    };

    return (

        <div className="flex justify-center mt-10">
            <div className="flex flex-col h-[700px] w-[800px] justify-center bg-gray-50 border-2 border blackrounded-lg">
                <header className="px-4 py-2 bg-blue-500 text-white">
                    <h1 className="text-lg font-semibold">
                        Chat with {driverName}
                    </h1>
                </header>
                <main className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100">
                    {messages.map((msg, index) => (
                        <Message 
                            key={index}
                            message={msg.text}
                            isUser={msg.isUser}
                        />
                    ))}
                </main>
                <footer className="p-4 bg-white border-t flex items-center">
                    <input 
                        type="text"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </footer>
            </div>

        </div>
        
    );
};

export default ChatPage;