import { create } from "zustand";
import type { SessionStatus, SessionUser } from "../types/AuthSession";

type SessionState = {
  status: SessionStatus;
  user: SessionUser | null;
  setAnonymous: () => void;
  setAuthenticated: (user: SessionUser | null) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  status: "initializing",
  user: null,
  setAnonymous: () => set({ status: "anonymous", user: null }),
  setAuthenticated: (user) => set({ status: "authenticated", user }),
}));
