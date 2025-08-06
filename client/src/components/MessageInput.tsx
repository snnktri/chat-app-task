import { sendMessage } from "@/apiHandler/message";
import { Input } from "./ui/input";
import { useState } from "react";
import type { Messages } from "@/types/chat.type";
import { useMessageStore } from "@/store/message.store";

const MessageInput = ({receiverId}: {receiverId: string}) => {
  const addMessage = useMessageStore((state) => state.addMessage);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const res = await sendMessage({message: message.trim(), receiverId});
      if(res.success) {
        const mess: Messages = res.data;
        addMessage(mess);
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="w-full relative px-6 py-2">
      <Input
        value={message}
        className="w-full py-3 pr-12 rounded-full border-gray-300 focus:border-blue-500 transition-colors"
        placeholder="Type a message..."
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <button 
        className={`absolute top-1/2 -translate-y-1/2 right-8 p-1.5 rounded-full transition-all duration-150 ${
          message.trim() && !isLoading 
            ? 'text-blue-500 hover:bg-blue-50 active:scale-95' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isLoading ? 'animate-pulse' : ''}`}
        >
          <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"/>
          <path d="M6 12h16"/>
        </svg>
      </button>
    </div>
  )
}

export default MessageInput