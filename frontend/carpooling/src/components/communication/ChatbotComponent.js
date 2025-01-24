import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";


const BACKEND_API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE_URL;

const ChatbotComponent = ({ onClose }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("chatbotMessages");
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messageEndRef = useRef(null);

    // Keep chat scrolled to bottom on new messages
    useEffect(() => {
        if(messageEndRef.current){
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        localStorage.setItem("chatbotMessages", JSON.stringify(messages));
    }, [messages]);

    const addMessage = (role, content) => {
        setMessages((prev) => [...prev, { role, content}]);
    }

    const updateBotMessage = (index, content) => {
        setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[index] = { role: "assistant", content};
            return updatedMessages;
        });
    };

    const fetchBotResponse = async (userInput, botMessageIndex) => {
        try {
            setLoading(true);
            const response = await fetch(
                `${BACKEND_API_BASE_URL}/stream?message=${encodeURIComponent(input)}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "text/event-stream",
                    },
                }
            );

            if (!response.body) throw new Error("ReadableStream not supported.");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let botMessageContent = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});
                botMessageContent += chunk;
                updateBotMessage(botMessageIndex, botMessageContent);
            }

        } catch (error) {
            console.error("Error streaming chatbot response:", error);
            updateBotMessage(botMessageIndex, "Error: Unable to process your message.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        addMessage("user", userMessage);

        const botMessageIndex = messages.length + 1;
        addMessage("assistant", "");

        setInput("")
        fetchBotResponse(userMessage, botMessageIndex);
    };

    return (
        <div className="fixed bottom-4 right-4 w-72 md:w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Chatbot</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === "user"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                            }`}
                        >
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                    </div>
                ))}
                {loading && <p className="text-gray-500">Typing...</p>}
                <div ref={messageEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg "
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatbotComponent;
