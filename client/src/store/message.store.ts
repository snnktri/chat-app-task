import { create } from "zustand";
import type { Messages } from "@/types/chat.type";

interface MessageStore {
  messages: Messages[];
  setMessages: (msgs: Messages[]) => void;
  addMessage: (msg: Messages) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
}));
