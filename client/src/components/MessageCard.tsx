import { useAuthStore } from "@/store/user.store";
import type { Messages } from "@/types/chat.type";

interface MessageProps {
  message: Messages;
}

const MessageCard: React.FC<MessageProps> = ({ message }) => {
  const currentUserId = useAuthStore((state) => state.getCurrentUserId)();
  const isSender = message.senderId._id === currentUserId;
  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`w-full px-3 mb-2 flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div className="relative max-w-[75%] sm:max-w-xs">
        <div
          className={`
            px-4 py-2.5 rounded-2xl shadow-sm
            transition-all duration-150 hover:shadow-md
            cursor-pointer
            ${isSender
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md dark:bg-gray-700 dark:text-white dark:border-gray-600"}
          `}
          onClick={() => console.log("Message ID:", message._id)}
        >
          <p className="text-sm leading-snug break-words">{message.message}</p>
        </div>
        <div className={`text-xs mt-1 px-1 ${isSender ? "text-right text-gray-400" : "text-left text-gray-400"}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;