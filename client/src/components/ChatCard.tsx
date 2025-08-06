import { getChatById } from "@/apiHandler/chat";
import { useChatStore } from "@/store/chat.store";
import { useSocketStore } from "@/store/socket.store";
import { useAuthStore } from "@/store/user.store";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import MessageInput from "./MessageInput";
import { useMessageStore } from "@/store/message.store";

const ChatCard = () => {
  const { socket } = useSocketStore();
  const chatId = useChatStore((state) => state.chatId);
  const currentUser = useAuthStore((state) => state.getCurrentUserId)();
  const setMessages = useMessageStore((state) => state.setMessages);
  const [receiverId, setReceiverId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const messages = useMessageStore((state) => state.messages);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchChat = useCallback(async () => {
    if (!chatId) return;
    setLoading(true);
    try {
      const res = await getChatById(chatId);
      if (res.success) {
        const chat = res.data.chat;
        const messages = res.data.messages;
        if (chat?.participants?.length === 2) {
          const other = chat.participants.find(
            (p) => String(p._id) !== String(currentUser)
          );
          if (other) setReceiverId(other._id);
          else console.warn("Other user not found.");
        } else {
          console.warn("participants missing.");
        }
        setMessages(messages);
      } else {
        console.error("Failed to fetch chat:", res.message);
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUser]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    if (!socket || !chatId || !socket.connected) return;
    socket.on("newMessage", fetchChat);
    socket.on("messageDelete", fetchChat);
    return () => {
      socket.off("newMessage", fetchChat);
      socket.off("messageDelete", fetchChat);
    };
  }, [socket, chatId, fetchChat]);

  return (
    <div className="w-full max-w-2xl mx-auto h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div
        ref={chatContainerRef}
        className="flex-1 flex flex-col-reverse overflow-y-auto px-2 py-4 space-y-reverse space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
              <span>Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((message) => (
              <MessageCard key={message._id} message={message} />
            ))
        )}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {receiverId && <MessageInput receiverId={receiverId} />}
      </div>
    </div>
  );
};

export default ChatCard;