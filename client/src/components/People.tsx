import { useEffect, useState, useCallback } from "react";
import { getAllUser } from "@/apiHandler/auth";
import { createChat } from "@/apiHandler/chat";
import { useChatStore } from "@/store/chat.store";
import { type LoggedUser } from "@/types/user.type";

const People = () => {
  const [nonFriends, setNonFriends] = useState<LoggedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const selectChat = useChatStore((state) => state.selectChatId);

  const fetchNonFriends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllUser();
      setNonFriends(res?.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNonFriends();
  }, [fetchNonFriends]);

  const handleClick = async (userId: string) => {
    try {
      const res = await createChat(userId);
      if (res?.success) {
        selectChat(res._id);
      }
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  return (
    <div className="w-full h-auto">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Start New Chat</h2>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : nonFriends.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          nonFriends.map((user) => (
            <div
              key={user._id}
              className="w-full h-auto p-4 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => handleClick(user._id)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={user.profile || "/default-avatar.png"}
                  alt={user.fullName || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-sm font-medium text-gray-800">
                  {user.fullName}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default People;
