import React from "react";

const Message = ({ message, senderId, userId, connectedUsers, timestamp }) => {
    const isMe = senderId === userId;
    const senderName = isMe
            ? 'Me'
            : connectedUsers.find((u) => u.chatUserId === senderId)?.fullName ||
            `User ${senderId}`;
    return (
        <div
            className={`my-1 md:my-2 p-3 rounded-lg max-w-[60%] break-words 
             ${isMe ? 'bg-blue-100 ml-auto' : 'bg-gray-200 mr-auto'}`}
        >
            <p>{message}</p>
            <small className="text-[10px] md:text-xs text-gray-500">
                {senderName} | {new Date(timestamp).toLocaleString()}
            </small>
         </div>
        );
};

export default Message;
