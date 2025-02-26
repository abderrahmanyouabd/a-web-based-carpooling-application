import React, { useState, useEffect } from "react";
import { Send, X } from "lucide-react";

const ChatbotComponent = ({ onClose }) => {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem("chatbotMessages");
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("chatbotMessages", JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        const botMessagePlaceholder = { role: "assistant", content: "" };

        setMessages((prev) => [...prev, userMessage, botMessagePlaceholder]);

        const botMessageIndex = messages.length + 1;
        setInput("");

        try {
            setLoading(true);

            const response = await fetch(
                `http://localhost:8080/stream?message=${encodeURIComponent(input)}`,
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

                const chunk = decoder.decode(value, { stream: true });
                botMessageContent += chunk;


                setMessages((prev) => {
                    const updatedMessages = [...prev];
                    updatedMessages[botMessageIndex] = {
                        role: "assistant",
                        content: botMessageContent,
                    };
                    return updatedMessages;
                });
            }
        } catch (error) {
            console.error("Error streaming chatbot response:", error);
            setMessages((prev) => {
                const updatedMessages = [...prev];
                updatedMessages[botMessageIndex] = {
                    role: "assistant",
                    content: "Error: Unable to process your message.",
                };
                return updatedMessages;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[32rem] bg-white rounded-lg shadow-xl flex flex-col">
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
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatbotComponent;
