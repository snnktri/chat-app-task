import { create } from "zustand";
import type { LoggedUser } from "@/types/user.type";

interface AuthState {
  user: LoggedUser | null;
  login: (user: LoggedUser) => void;
  logout: () => void;
  getCurrentUserId: () => string | null;
  setSelectUser: (id: string) => void;
  selectedUser: string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  selectedUser: null,

  login: (userData) => set({ user: userData }),

  logout: () => set({ user: null }),

  getCurrentUserId: () => get().user?._id || null,

  setSelectUser: (id: string) => set({selectedUser: id}),
}));
