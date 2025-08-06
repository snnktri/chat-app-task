import { getAllChat } from "@/apiHandler/chat";
import type { Chat } from "@/types/chat.type";
import { useChatStore } from "@/store/chat.store";
import { useSocketStore } from "@/store/socket.store";
import { useState, useEffect } from "react";
import PeopleCard from "./PeopleCard";
import { useAuthStore } from "@/store/user.store";

const ChatList = () => {
  const [friends, setFriends] = useState<Chat[]>([]);
  const chatId = useChatStore((state) => state.chatId);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const currentUserId = useAuthStore((state) => state.getCurrentUserId());

  useEffect(() => {
    const fetchChats = async () => {
      const chat = await getAllChat();
      setFriends(chat.data);
    };
    fetchChats();
  }, [chatId]);

  return (
    <div className="w-full h-auto">
      <div className="w-full p-2">
        <h2 className="text-2xl font-bold mb-4">Friends</h2>
        {friends.map((chat) => {
        
          const otherUser = chat.participants.find((p) => p._id !== currentUserId);
           const isAnyOnline = onlineUsers.includes(otherUser?._id!);

          return (
            <PeopleCard
              key={chat._id}
              participant={chat.participants}
              chatId={chat._id}
              isOnline={isAnyOnline}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
