import { create } from "zustand";
import { socket } from "@/lib/socket";

interface SocketStore {
  socket: typeof socket;
  isConnected: boolean;
  onlineUsers: string[];
  connect: (userId: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket,
  isConnected: false,
  onlineUsers: [],

  connect: (userId: string) => {
    if (!socket.connected) {
      socket.auth = { userId };
      socket.connect();

      socket.on("connect", () => {
        console.log(" Socket connected:", socket.id);
        set({ isConnected: true });
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        set({ isConnected: false, onlineUsers: [] });
      });

 
      socket.on("onlineUsers", (users: string[]) => {
        set({ onlineUsers: users });
      });

   
      socket.on("userOnline", (userId: string) => {
        const current = get().onlineUsers;
        if (!current.includes(userId)) {
          set({ onlineUsers: [...current, userId] });
        }
      });

   
      socket.on("userOffline", (userId: string) => {
        const current = get().onlineUsers;
        set({ onlineUsers: current.filter((id) => id !== userId) });
      });
    }
  },

  disconnect: () => {
    if (socket.connected) {
      socket.disconnect();
      set({ isConnected: false, onlineUsers: [] });
    }
  },
}));
