import { useEffect, useCallback } from "react";
import { getChatById } from "@/apiHandler/chat";
import { useAuthStore } from "@/store/user.store";
import { socket } from "@/lib/socket";

const useChatSetup = (chatId: string, setChats: Function, setReceiverId: Function, setLoading: Function) => {
  const currentUser = useAuthStore.getState().getCurrentUserId();


  const fetchChat = useCallback(async () => {
    if (!chatId) return;

    setLoading(true);
    try {
      const chat = await getChatById(chatId);

      if (chat.success && chat.data.chat?.participants?.length === 2) {
        const otherUser = chat.data.chat.participants.find(
          (p) => String(p._id) !== String(currentUser)
        );
        if (otherUser) {
          setReceiverId(otherUser._id);
        } else {
          console.warn("Other user not found");
        }
        setChats(chat.data.messages);
      } else {
        console.warn("Chat fetch failed or not a 2-person chat");
      }
    } catch (err) {
      console.error("Error fetching chat:", err);
    } finally {
      setLoading(false);
    }
  }, [chatId, currentUser, setChats, setReceiverId, setLoading]);


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
};

export default useChatSetup;
