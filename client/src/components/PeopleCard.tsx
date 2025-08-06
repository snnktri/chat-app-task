import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/user.store";
import { type Participant } from "@/types/chat.type";

interface PeopleCardProps {
  participant: Participant[];
  chatId: string;
  isOnline?: boolean;
}

const PeopleCard: React.FC<PeopleCardProps> = ({ participant, chatId, isOnline }) => {
  const selectChatId = useChatStore((state) => state.selectChatId);
  const currentUserId = useAuthStore((state) => state.getCurrentUserId());
  const setSelectUser = useAuthStore((state) => state.setSelectUser);

  const handleClick = () => {
    selectChatId(chatId);
  };


 
  const other = participant.find(p => String(p._id) !== String(currentUserId));

  return (
    <div
      className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition"
      onClick={handleClick}
    >
      {/* Avatar placeholder */}
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
        {other?.fullName?.charAt(0).toUpperCase() ?? "U"}
      </div>

      {/* Name and online status */}
      <div className="flex-1">
        <div className="font-medium text-gray-900" onClick={() => setSelectUser(other?._id!)}>
          {other?.fullName ?? "Unknown User"}
        </div>
        <div className={`text-sm ${isOnline ? "text-green-500" : "text-gray-400"}`}>
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default PeopleCard;
