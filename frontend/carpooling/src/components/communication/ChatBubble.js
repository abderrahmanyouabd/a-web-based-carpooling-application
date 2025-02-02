import { MessageCircle } from 'lucide-react';

const ChatBubble = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors duration-200"
            aria-label="Open chat"
        >
            <MessageCircle size={24} />
        </button>
    )
}

export default ChatBubble