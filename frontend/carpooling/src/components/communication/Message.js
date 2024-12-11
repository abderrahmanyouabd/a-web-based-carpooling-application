import React from "react";

const Message = ({ message, isUser }) => {
    return (
        <div className={`flex mb-4 ${ isUser ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs 
                ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                    {message}
            </div>
        </div>
    );
};

export default Message;
