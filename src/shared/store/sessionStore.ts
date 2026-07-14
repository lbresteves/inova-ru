import { create } from "zustand";

export type SessionUser = {
  name: string;
  email: string;
  isStudent: boolean;
  isEmployee: boolean;
};

export type SessionState = {
  token: string | null;
  user: SessionUser | null;
  setSession: (token: string, user: SessionUser) => void;
  clearSession: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  token: null,
  user: null,
  setSession: (token, user) => set({ token, user }),
  clearSession: () => set({ token: null, user: null }),
}));
