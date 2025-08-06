import { create } from "zustand";

interface ChatStore {
  chatId: string | null;
  selectChatId: (id: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatId: null,
  selectChatId: (id: string) => set({ chatId: id }),
}));
